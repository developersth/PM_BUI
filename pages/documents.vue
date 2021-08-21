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
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait"
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
    <DocumentsForm ref="DocumentsForm" @add="submitAdd" @edit="submitEdit" />
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
  </v-card>
</template>

<script>
import DocumentsForm from '~/components/forms/DocumentsForm'
import apiService from '~/server/plugins/service'
const service = new apiService()
export default {
  components: { DocumentsForm },
  data() {
    return {
      search: '',
      snackbar: {
        show: false,
        text: '',
        type: '',
      },
      currentPK: null,
      confirm: false,
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
    async fetchData() {
      this.loading = true
      try {
        await service.getAllDocuments().then((response) => {
          this.desserts = response
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
    },
    async editItem(item) {
      try {
        this.currentPK = item.id
        await service.getDocumentsById(this.currentPK).then((response) => {
          this.$refs.DocumentsForm.open('edit', response)
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
    async submitAdd(data) {
      try {
        this.$refs.DocumentsForm.dialogLoading = true
        const result = await service.addDocuments(data)
        if (result.success) {
          this.snackbar = {
            show: true,
            text: result.message,
            type: 'success',
          }
          this.$refs.DocumentsForm.dialogLoading = false
          this.$refs.DocumentsForm.close()
          this.fetchData()
        } else {
          this.snackbar = {
            show: true,
            text: result.message,
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
        const result = await this.$axios.$put(
          `/api/moji/${this.currentPK}`,
          data
        )
        if (result) {
          this.snackbar = {
            show: true,
            text: 'Success',
            type: 'success',
          }
          this.$refs.DocumentsForm.close()
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
        const result = await service.deleteDocuments(this.currentPK)
        if (result.success) {
          this.snackbar = {
            show: true,
            text: result.message,
            type: 'success',
          }
        } else {
          this.snackbar = {
            show: true,
            text: result.message,
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
  },
}
</script>
