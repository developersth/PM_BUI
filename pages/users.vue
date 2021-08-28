<template>
  <v-card width="100vw">
    <v-app-bar dark color="pink">
      <v-toolbar-title>ข้อมูลผู้ใช้งาน</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn depressed color="green" @click="addItem" :disabled="!isAdmin">
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
      :headers="headers"
      :items="desserts"
      :search="search"
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          class="mx-2"
          fab
          dark
          small
          color="teal"
          @click="editItem(item)"
          :disabled="!isAdmin"
        >
          <v-icon dark> mdi-pencil </v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          dark
          small
          color="red"
          @click="deleteItem(item)"
          :disabled="!isAdmin"
        >
          <v-icon dark> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <UsersForm ref="UsersForm" @add="submitAdd" @edit="submitEdit" />
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
import UsersForm from '~/components/forms/UsersForm'
import * as api from '~/utils/service'
export default {
  components: { UsersForm },
  middleware: 'auth',
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
        { text: 'ชื่อ-สกุล', value: 'name' },
        { text: 'ชื่อผู้ใช้งาน', value: 'username' },
        { text: 'เบอร์โทร', value: 'mobile' },
        { text: 'อีเมล์', value: 'email' },
        { text: 'สิทธิ์การใช้งานระบบ', value: 'role_name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
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
        await api.getUserAll().then((response) => {
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
          this.$refs.UsersForm.itemsUserRoles = result.data
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    addItem() {
      this.$refs.UsersForm.open('add')
      this.getUserRoles()
    },
    editItem(item) {
      this.currentPK = item.id
      this.$refs.UsersForm.open('edit', item)
    },
    deleteItem(item) {
      this.currentPK = item.id
      this.confirm = true
    },
    async submitAdd(data) {
      try {
        const result = await api.addUsers(data)
        if (result.data) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.UsersForm.close()
          this.fetchData()
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
        const result = await api.editUsers(this.currentPK, data)
        if (result.data) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.$refs.UsersForm.close()
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
        const result = await api.deleteUsers(this.currentPK)
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
