<template>
  <v-card width="100vw">
    <v-app-bar dark color="pink">
      <v-toolbar-title>Payment</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn depressed color="green" @click="addItem">
        เพิ่มข้อมูล <v-icon> mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card-title>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :search="search"
      class="elevation-1"
      :loading="loading"
      show-select
      loading-text="Loading... Please wait"
    >
      <template v-slot:[`item.Status`]="{ item }">
        <v-chip :color="getColor(item.Status)" dark>
          {{ item.Status }}
        </v-chip>
      </template>
      <template v-slot:[`item.PaymentDate`]="{ item }">
        <span v-if="item.PaymentDate">{{
          $dateFns.format(item.PaymentDate, 'dd/MM/yyyy')
        }}</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          class="mx-2"
          fab
          dark
          small
          color="green"
          @click="showItem(item)"
        >
          <v-icon dark> mdi-eye</v-icon>
        </v-btn>
        <v-btn class="mx-2" fab dark small color="teal" @click="editItem(item)">
          <v-icon dark> mdi-pencil </v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          dark
          small
          color="red"
          @click="deleteItem(item)"
        >
          <v-icon dark> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <PaymentForm
      ref="PaymentForm"
      @add="submitAdd"
      @edit="submitEdit"
      @paymentChange="paymentChange"
      @openSupplier="openSupplier"
      @openFreightForwarder="openFreightForwarder"
    />
    <SupplierForm ref="SupplierForm" @add="submitAddSupplier" />
    <FreightForwarderForm
      ref="FreightForwarderForm"
      @add="submitFreightForwarder"
    />
    <v-snackbar v-model="snackbar.show" :color="snackbar.type">
      {{ snackbar.text }}
      <v-btn color="blue" text @click="snackbar.show = false"> Close </v-btn>
    </v-snackbar>
    <v-dialog v-model="confirm" max-width="350">
      <v-card>
        <v-toolbar dark color="red">
          <v-toolbar-title class="headline">ยืนยันการลบ?</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text> เมื่อยืนยันคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้ </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn text @click="confirm = false"> Cancel </v-btn>

          <v-btn color="green darken-1" text @click="submitDelete">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmAction" max-width="350">
      <v-card>
        <v-toolbar dark color="red">
          <v-toolbar-title class="headline">ยืนยันการลบ?</v-toolbar-title>
        </v-toolbar>

        <v-card-text> เมื่อยืนยันคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้ </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn text @click="confirmAction = false"> Cancel </v-btn>

          <v-btn color="green darken-1" text @click="validateAction()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-actions>
      <v-col class="d-flex" cols="12" sm="2">
        <v-select v-model="action" :items="itemsAction"></v-select>
        <v-btn class="mt-4" color="info" @click="deleteItemAction()">
          ทำกับที่เลือก
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import PaymentForm from '~/components/forms/PaymentForm.vue'
import SupplierForm from '~/components/forms/SupplierForm.vue'
import FreightForwarderForm from '~/components/forms/FreightForwarderForm.vue'
import * as api from '~/utils/service'
export default {
  components: { PaymentForm, SupplierForm, FreightForwarderForm },
  middleware: 'auth',
  data() {
    return {
      selected: [],
      loading: false,
      search: '',
      snackbar: {
        show: false,
        text: '',
        type: '',
      },
      currentPK: null,
      confirm: false,
      confirmAction: false,
      headers: [
        { text: 'รหัส', value: 'id' },
        { text: 'สถานะ', value: 'Status' },
        { text: 'วันที่จ่าย', value: 'PaymentDate' },
        { text: 'จ่ายให้', value: 'PaymentTo' },
        { text: 'Po No.', value: 'PoNo' },
        { text: 'เพื่อใช้', value: 'PurposeName' },
        { text: 'จำนวนเงิน', value: 'PriceTotal' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      action: 'ลบ',
      itemsAction: ['ลบ'],
    }
  },
  mounted() {
    this.fetchData()
    this.getUserRoles()
  },
  computed: {
    isAdmin: {
      get() {
        return this.$store.getters.isAdmin
      },
    },
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        await api.getPaymentAll().then((response) => {
          this.desserts = response.data
          this.loading = false
        })
      } catch (e) {
        this.loading = false
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    async getUserRoles() {
      try {
        const result = await api.getUserRoles()
        if (result.data) {
          this.$refs.PaymentForm.itemsUserRoles = result.data
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    validateAction() {
      if (this.action === 'ลบ') {
        this.submitDeleteItems(this.selected)
      }
    },
    addItem() {
      this.$refs.PaymentForm.open('add')
      this.getUserRoles()
      this.getSupplier()
    },
    async editItem(item) {
      try {
        this.currentPK = item.id
        await api.getPaymentById(this.currentPK).then((response) => {
          this.$refs.PaymentForm.open('edit', response.data)
        })
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    async showItem(item) {
      try {
        this.currentPK = item.id
        await api.getPaymentById(this.currentPK).then((response) => {
          this.$refs.PaymentForm.open('show', response.data)
        })
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    deleteItem(item) {
      this.currentPK = item.id
      this.confirm = true
    },
    deleteItemAction(item) {
      this.confirmAction = true
    },
    async submitAdd(data) {
      try {
        this.$refs.PaymentForm.loading = true
        const result = await api.addPayments(data)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.PaymentForm.loading = false
          this.$refs.PaymentForm.close()
          this.fetchData()
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
          this.$refs.PaymentForm.loading = false
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
        this.$refs.PaymentForm.loading = false
      }
    },
    async submitEdit(data) {
      try {
        const result = await api.editPayment(this.currentPK, data)
        if (result.data) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.PaymentForm.close()
          this.fetchData()
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: 'Fail',
          type: 'error',
        }
      }
    },
    async submitDelete() {
      this.confirm = false
      try {
        const result = await api.deletePayment(this.currentPK)
        if (result.data) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
        }
        this.fetchData()
      } catch (e) {
        this.snackbar = {
          show: true,
          text: 'Fail',
          type: 'error',
        }
      }
    },
    async submitDeleteItems(items) {
      this.confirmAction = false
      try {
        const result = await api.deletePaymentItems(items)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.fetchData()
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    getColor(status) {
      if (status == 'Incomplete') return 'red'
      else if (status == 'Completed') return 'green'
      else return 'indigo'
    },
    //PaymentForm
    openFreightForwarder() {
      this.$refs.FreightForwarderForm.open('add')
    },
    openSupplier() {
      this.$refs.SupplierForm.open('add')
    },
    async submitAddSupplier(items) {
      try {
        const result = await api.addSupplier(items)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.SupplierForm.close()
          this.getSupplier()
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    async submitFreightForwarder(items) {
      try {
        const result = await api.addFreightForwarders(items)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.FreightForwarderForm.close()
          this.getFreigh()
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    paymentChange(name) {
      console.log('name', name)
      if (name.toLowerCase() === 'supplier') this.getSupplier()
      else this.getFreigh()
    },
    async getSupplier() {
      try {
        const result = await api.getSupplier()
        if (result.data) {
          const data = []
          result.data.forEach((element) => {
            if (element.status)
              //status true
              data.push(element.name)
          })
          this.$refs.PaymentForm.itemsPaymentTo = data
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    async getFreigh() {
      try {
        const result = await api.getFreightForwordersAll()
        if (result.data) {
          const data = []
          result.data.forEach((element) => {
            if (element.status)
              //status true
              data.push(element.name)
          })
          this.$refs.PaymentForm.itemsPaymentTo = data
        }
      } catch (e) {
        console.log(e.message)
      }
    },
  },
}
</script>
