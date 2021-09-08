<template>
  <v-card width="100vw">
    <v-app-bar dark color="primary">
      <v-toolbar-title>ข้อมูล Supplier</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn depressed color="green" @click="addItem">
        เพิ่มข้อมูล <v-icon> mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>

    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getColor(item.status)" dark>
          {{ getStatus(item.status) }}
        </v-chip>
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
    <SupplierForm ref="SupplierForm" @add="submitAdd" @edit="submitEdit" />
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
  </v-card>
</template>

<script>
import SupplierForm from '~/components/forms/SupplierForm.vue'
import * as api from '~/utils/service'
export default {
  components: { SupplierForm },
  //middleware: 'auth',
  data() {
    return {
      loading: false,
      search: '',
      snackbar: {
        show: false,
        text: '',
        type: '',
      },
      currentPK: null,
      confirm: false,
      headers: [
        { text: 'รหัส', value: 'id' },
        { text: 'ชื่อผู้ขอซื้อ', value: 'name' },
        { text: 'สถานะการใช้งาน', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
    }
  },
  mounted() {
    this.fetchData()
  },
  computed: {
    isAdmin: {
      get() {
        return this.$store.getters.isAdmin
      },
    },
  },
  methods: {
    getColor(status) {
      if (status) return 'green'
      else return 'red'
    },
    getStatus(val){
      if(val)
       return  'สามารถใช้งานได้'
      else
        return 'หยุดใช้งาน'
    },
    async fetchData() {
      this.loading = true
      try {
        await api.getSupplier().then((response) => {
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
      this.$refs.SupplierForm.open('add')
    },
    editItem(item) {
      this.currentPK = item.id
      this.$refs.SupplierForm.open('edit', item)
    },
    deleteItem(item) {
      this.currentPK = item.id
      this.confirm = true
    },
    async submitAdd(data) {
      try {
        const result = await api.addSupplier(data)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.SupplierForm.close()
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
    async submitEdit(data) {
      try {
        const result = await api.editSupplier(this.currentPK, data)
        if (result.data) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.SupplierForm.close()
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
        const result = await api.deleteSupplier(this.currentPK)
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
  },
}
</script>
