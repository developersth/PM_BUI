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
      @openBuyer="openBuyer"
      @openDeliveryTerm="openDeliveryTerm"
      @openFreightForwarder="openFreightForwarder"
    />
    <SupplierForm ref="SupplierForm" @add="submitAddSupplier" />
    <PaymentTermForm ref="PaymentTermForm" @add="submitPaymentTerm" />
    <BuyerForm ref="BuyerForm" @add="submitBuyer" />
    <DeliveryTermForm ref="DeliveryTermForm" @add="submitDeliveryTerm" />
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
        <v-toolbar dark color="red">
          <v-toolbar-title class="headline"
            >ยืนยันการ {{ action }}?</v-toolbar-title
          >
        </v-toolbar>

        <v-card-text v-if="action === 'ลบ'">
          เมื่อยืนยันคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้
        </v-card-text>
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
      <v-col class="d-flex" cols="12" sm="3">
        <v-select v-model="action" :items="itemsAction"></v-select>
        <v-btn class="mt-4" color="info" @click="deleteItemAction()">
          ทำกับที่เลือก
        </v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import XLSX from 'xlsx' // import xlsx
import DocumentsForm from '~/components/forms/DocumentsForm'
import SupplierForm from '~/components/forms/SupplierForm.vue'
import PaymentTermForm from '~/components/forms/PaymentTermForm.vue'
import BuyerForm from '~/components/forms/BuyerForm.vue'
import DeliveryTermForm from '~/components/forms/DeliveryTermForm.vue'
import FreightForwarderForm from '~/components/forms/FreightForwarderForm.vue'

import * as api from '~/utils/service'
export default {
  components: {
    DocumentsForm,
    SupplierForm,
    PaymentTermForm,
    BuyerForm,
    DeliveryTermForm,
    FreightForwarderForm,
  },
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
      itemsAction: ['ลบ', 'export'],
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
      if (this.action === 'ลบ') {
        this.submitDeleteItems(this.selected)
      } else if (this.action === 'export') {
        this.onExport(this.selected)
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
      if (this.selected.length === 0) return
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
      this.confirmAction = false
      try {
        const result = await api.deleteDocumentsItems(items)
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
          this.$refs.SupplierForm.close()
          this.$refs.DocumentsForm.getSupplier()
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
    //Payment Term
    openPaymentTerm() {
      this.$refs.PaymentTermForm.open('add')
    },
    async submitPaymentTerm(items) {
      try {
        const result = await api.addPaymentTerm(items)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.PaymentTermForm.close()
          this.$refs.DocumentsForm.getPaymentTerm()
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
    //Buyer
    openBuyer() {
      this.$refs.BuyerForm.open('add')
    },
    async submitBuyer(items) {
      try {
        const result = await api.addBuyer(items)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.BuyerForm.close()
          this.$refs.DocumentsForm.getBuyers()
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
    openDeliveryTerm() {
      this.$refs.DeliveryTermForm.open('add')
    },
    async submitDeliveryTerm(items) {
      try {
        const result = await api.addDeliveryTerm(items)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.DeliveryTermForm.close()
          this.$refs.DocumentsForm.getDeliveryTerm
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
    openFreightForwarder() {
      this.$refs.FreightForwarderForm.open('add')
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
          this.$refs.DocumentsForm.getFreightForwarder()
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
    //Report
    async onExport(item) {
      try {
        this.confirmAction = false
        const result = await api.getDocumentExport(item)
        this.data = result.data
        const dataWS = XLSX.utils.json_to_sheet(this.data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, dataWS)
        XLSX.writeFile(wb, `${Date.now()}_work status.xlsx`)
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
