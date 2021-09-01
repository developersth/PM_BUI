<template>
  <v-card width="100vw">
    <v-app-bar dark color="pink">
      <v-toolbar-title>จัดการเอกสาร</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn depressed color="green" @click="addItem">
        <v-icon> mdi-plus</v-icon> Add New
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
      :headers="headers"
      :items="desserts"
      :search="search"
      v-model="selected"
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait"
      show-select
    >
      <template v-slot:[`item.Status`]="{ item }">
        <v-chip :color="getColor(item.Status)" dark>
          {{ item.Status }}
        </v-chip>
      </template>

      <template v-slot:[`item.DocDate`]="{ item }">
        <span v-if="item.DocDate">{{
          $dateFns.format(item.DocDate, 'dd/MM/yyyy')
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
    <DocumentsForm
      ref="DocumentsForm"
      @add="submitAdd"
      @edit="submitEdit"
      @openSupplier="openSupplier"
      @openPaymentTerm="openPaymentTerm"
    />
    <SupplierForm ref="SupplierForm" @add="submitAddSupplier" />
    <PaymentTermForm ref="PaymentTermForm" @add="submitPaymentTerm" />

    <v-snackbar v-model="snackbar.show" :color="snackbar.type">
      {{ snackbar.text }}
      <v-btn color="blue" text @click="snackbar.show = false"> Close </v-btn>
    </v-snackbar>
    <v-dialog v-model="confirm" max-width="350">
      <v-card>
        <v-card-title class="headline"> ยืนยันการลบ? </v-card-title>

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
        <v-card-title class="headline"> ยืนยันการลบ? </v-card-title>

        <v-card-text> เมื่อยืนยันคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้ </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn text @click="confirmAction = false"> Cancel </v-btn>

          <v-btn color="green darken-1" text @click="vadidateAction()">
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
import DocumentsForm from '~/components/forms/DocumentsForm'
import SupplierForm from '~/components/forms/SupplierForm.vue'
import PaymentTermForm from '~/components/forms/PaymentTermForm.vue'
import * as api from '~/utils/service'
export default {
  components: { DocumentsForm, SupplierForm, PaymentTermForm },
  data() {
    return {
      selected: [],
      search: '',
      snackbar: {
        show: false,
        text: '',
        type: '',
      },
      action: 'ลบ',
      itemsAction: ['ลบ'],
      currentPK: null,
      confirm: false,
      confirmAction: false,
      headers: [
        { text: 'เลขที่เอกสาร', value: 'DocNo' },
        { text: 'สถานะ', value: 'Status' },
        { text: 'วันที่เอกสาร', value: 'DocDate' },
        { text: 'เลขใบสั่งซื้อ', value: 'PoNo' },
        { text: 'ผู้สั่งซื้อ', value: 'Buyer' },
        { text: 'Supplier', value: 'Supplier' },
        { text: 'Invoice No', value: 'InvoiceNo' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      loading: false,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    vadidateAction() {
      let formData = new FormData()
      if (this.action === 'ลบ') {
        const data = []
        for (var key in this.selected) {
          data.push({ id: this.selected[key].id })
        }
        console.log(data)
        formData.append('data', data)
        this.submitDeleteItems(formData)
      }
    },
    //DocumentsForm

    async fetchData() {
      this.loading = true
      try {
        await api.getAllDocuments().then((response) => {
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
    addItem() {
      this.$refs.DocumentsForm.open('add')
      //this.getNameUsers()
      //this.getSupplier()
      //this.getPaymentTerm()
    },
    async editItem(item) {
      try {
        this.currentPK = item.id
        await api.getDocumentsById(this.currentPK).then((response) => {
          this.$refs.DocumentsForm.open('edit', response.data)
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
    async showItem(item) {
      try {
        this.currentPK = item.id
        await api.getDocumentsById(this.currentPK).then((response) => {
          this.$refs.DocumentsForm.open('show', response.data)
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
    deleteItem(item) {
      this.currentPK = item.id
      this.confirm = true
    },
    deleteItemAction(item) {
      this.confirmAction = true
    },
    async submitAdd(data) {
      try {
        this.$refs.DocumentsForm.dialogLoading = true
        const result = await api.addDocuments(data)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.DocumentsForm.dialogLoading = false
          this.$refs.DocumentsForm.close()
          this.fetchData()
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
          this.$refs.DocumentsForm.dialogLoading = false
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
        this.$refs.DocumentsForm.dialogLoading = false
      }
    },
    async submitEdit(data) {
      try {
        this.$refs.DocumentsForm.dialogLoading = true
        const result = await api.editDocuments(this.currentPK, data)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.DocumentsForm.dialogLoading = false
          this.$refs.DocumentsForm.close()
          this.fetchData()
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
          this.$refs.DocumentsForm.dialogLoading = false
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
        this.$refs.DocumentsForm.dialogLoading = false
      }
    },
    async submitDelete() {
      this.confirm = false
      try {
        const result = await api.deleteDocuments(this.currentPK)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
        }
        this.fetchData()
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    async submitDeleteItems(items) {
      console.log(items)
      this.confirm = false
      try {
        const result = await api.deleteDocumentsItems(items)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
        }
        this.fetchData()
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    getColor(status) {
      if (status == 'Incomplete') return 'secondary'
      else if (status == 'Acknowledged') return 'primary'
      else if (status == 'In Progress') return 'orange'
      else if (status == 'Shipped') return 'pink'
      else if (status == 'Received') return 'red'
      else if (status == 'Completed') return 'green'
      else return 'indigo'
    },
    //Supplierform
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
          this.getSupplier()
          this.$refs.SupplierForm.close()
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
        }
        this.fetchData()
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
    //Payment Term
    openPaymentTerm() {
      this.$refs.PaymentTermForm.open('add')
    },
    async submitPaymentTerm(items) {
      try {
        const result = await api.addPaymentTerm(items)
        if (result.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.PaymentTermForm.close()
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
        }
        this.fetchData()
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
      }
    },
  },
}
</script>
