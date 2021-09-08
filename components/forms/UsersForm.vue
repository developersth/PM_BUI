<template>
  <v-dialog
    v-model="dialog"
    persistent
    transition="dialog-top-transition"
    max-width="600px"
  >
    <v-card>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="save()"
      >
        <v-toolbar dark color="primary">
          <v-toolbar-title>ข้อมูลผู้ใช้งาน #{{ mode }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="users.username"
                  label="ชื่อผู้ใช้งาน*"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="users.name"
                  label="ชื่อ-สกุล*"
                  required
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="users.password"
                  label="รหัสผ่าน*"
                  type="password"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="users.email" label="อีเมล์*" required />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="users.mobile"
                  label="เบอร์โทร*"
                  type="number"
                  required
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="users.role_id"
                  :items="itemsUserRoles"
                  item-value="id"
                  item-text="name"
                  label="สิทธิการใช้งาน"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8"> </v-col>
              <v-col cols="4">
                <v-switch
                  v-model="users.status"
                  :label="`สามารถใช้งานได้`"
                ></v-switch>
              </v-col>
            </v-row>
            <v-spacer />
            <small class="red--text">*โปรดระบุข้อมูลตามที่กำหนด</small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" @click="dialog = false"> CLOSE </v-btn>
          <v-btn
            class="ma-2"
            :loading="loading"
            :disabled="loading"
            color="primary"
            @click="save()"
          >
            SAVE
            <v-icon right dark> mdi-content-save</v-icon>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      dialog: false,
      mode: '',
      itemsUserRoles: [],
      users: {
        username: '',
        name: '',
        email: '',
        password: '',
        mobile: '',
        status: true,
        role_id: null,
      },
    }
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 3000)

      this.loader = null
    },
  },
  methods: {
    open(mode, data) {
      this.dialog = true
      this.mode = mode
      if (data) {
        this.users = { ...data }
      }
    },
    close() {
      this.dialog = false
      this.clearData()
    },
    clearData() {
      this.users = {
        username: '',
        name: '',
        email: '',
        password: '',
        mobile: '',
        status: true,
        role_id: null,
      }
    },
    save() {
      this.$emit(this.mode, this.users)
    },
  },
}
</script>