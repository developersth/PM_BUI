<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="elevation-12">
          <v-window>
            <v-window-item>
              <v-row>
                <v-col cols="12" md="8">
                  <v-form @submit.prevent="userLogin">
                    <v-card-text class="mt-12">
                      <h1
                        class="text-center display-2 teal--text text--accent-3"
                      >
                        Sign in
                      </h1>

                      <h4 class="text-center mt-4">ลงชื่อเข้าใช้งานระบบ</h4>
                      <v-text-field
                        v-model="login.username"
                        label="Username"
                        type="text"
                        color="teal accent-3"
                      />

                      <v-text-field
                        v-model="login.password"
                        label="Password"
                        name="password"
                        type="password"
                        color="teal accent-3"
                      />

                      <h3 class="text-center mt-4">Forgot your password ?</h3>
                    </v-card-text>
                    <div class="text-center mt-3">
                      <v-btn rounded color="teal accent-3" dark type="submit"
                        >SIGN IN</v-btn
                      >
                    </div>
                  </v-form>
                </v-col>
                <v-col cols="12" md="4" class="teal accent-3">
                  <v-card-text class="white--text mt-12">
                    <h1>ยินดีต้อนรับ, ระบบจัดซื้อ!</h1>
                    <h5 class="text-center">โปรดลงชื่อเข้าใช้งานระบบ</h5>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.type">
      {{ snackbar.text }}
      <v-btn color="blue" text @click="snackbar.show = false"> Close </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      login: {
        username: '',
        password: '',
      },
      error: null,
      snackbar: {
        show: false,
        text: '',
        type: '',
      },
    }
  },
  methods: {
     userLogin() {
      try {
  /*       const response = await this.$auth.loginWith('local', {
          data: this.login,
        }) */
        this.$store.dispatch('onLogin',{
          username:this.login.username,
          password:this.login.password
        })
        if (this.$store.state.success) {
          this.snackbar = {
            show: true,
            text: this.$store.state.success,
            type: 'success',
          }
        } else {
          this.snackbar = {
            show: true,
            text: this.$store.state.success,
            type: 'warning',
          }
        }
      } catch (err) {
        console.log(err)
        this.snackbar = {
          show: true,
          text: err.message,
          type: 'warning',
        }
      }
    },
  },
}
</script>