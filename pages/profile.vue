<template>
  <v-card :loading="loading" class="mx-auto" max-width="600">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img height="250" src="./pexels-max-vakhtbovych-5997967.jpg"></v-img>

    <v-card-title>Profile</v-card-title>
    <v-form
      @submit.prevent="submitEdit()"
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="users.username"
                :rules="usernameRules"
                label="ชื่อผู้ใช้งาน*"
                color="teal accent-3"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="users.name"
                :rules="nameRules"
                label="ชื่อ-สกุล"
                color="teal accent-3"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="users.password"
                label="รหัสผ่าน"
                type="password"
                color="teal accent-3"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="users.email"
                label="อีเมล์"
                color="teal accent-3"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="users.mobile"
                label="เบอร์โทร"
                color="teal accent-3"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="users.role_name"
                label="สิทธิการใช้งาน"
                color="teal accent-3"
                :readonly="true"
              />
            </v-col>
          </v-row>
          <v-spacer />
        </v-container>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-actions>
        <v-spacer />
        <v-btn
          type="submit"
          rounded
          :loading="loading"
          :disabled="loading"
          color="primary"
        >
          Save
          <v-icon right dark> mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
    </v-form>
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please Wait
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.show" :color="snackbar.type">
      {{ snackbar.text }}
      <v-btn color="blue" text @click="snackbar.show = false"> Close </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import * as api from '~/utils/service'
export default {
  data: () => ({
    valid: true,
    loading: false,
    selection: 1,
    dialog: false,
    mode: '',
    userId: '',
    itemsUserRoles: [],
    users: {
      username: '',
      name: '',
      email: '',
      password: '',
      mobile: '',
      status: true,
      role_id: null,
      role_name: '',
    },
    usernameRules: [(v) => !!v || 'โปรดระบุชื่อเข้าใช้งาน.'],
    nameRules: [(v) => !!v || 'โปรดระบุ ชื่อ-สกุล ผู้ใช้งาน'],
    snackbar: {
      show: false,
      text: '',
      type: '',
    },
  }),
  mounted() {
    this.userId = this.$store.getters.isUserId
    this.bindData()
  },
  methods: {
    async submitEdit() {
      try {
        if (!this.$refs.form.validate()) return //chek validate
        this.loading = true
        const body = {
          username: this.users.username,
          name: this.users.name,
          email: this.users.email,
          password: this.users.password,
          mobile: this.users.mobile,
        }
        const result = await api.editUsers(this.userId,body)
        if (result.data.success) {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'success',
          }
          this.bindData()
          this.loading = false
        } else {
          this.snackbar = {
            show: true,
            text: result.data.message,
            type: 'warning',
          }
          this.loading = false
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: e.message,
          type: 'error',
        }
        this.loading = false
      }
    },
    async bindData() {
      try {
        const result = await api.findUserById(this.userId)
        if (result.data) {
          this.users.username = result.data.username
          this.users.name = result.data.name
          this.users.email = result.data.email
          this.users.mobile = result.data.mobile
          this.users.role_name = result.data.role_name
        }
      } catch (e) {
        console.log(e.message)
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
  },
}
</script>

<style>
</style>