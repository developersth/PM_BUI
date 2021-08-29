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

                      <h4 class="text-center mt-4">sign in  your username and password</h4>
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

                      <h3 class="text-center mt-4">forget password?</h3>
                    </v-card-text>
                    <div class="text-center mt-3">
                      <v-btn rounded color="teal accent-3" dark type="submit"
                        >SIGN IN</v-btn
                      >
                    </div>
                  </v-form>
                </v-col>
                <v-col cols="12" md="4" class="d-flex">
                  <v-row>
                    <v-card  class="mx-auto" max-width="374">
                      <v-img
                        height="250"
                        src="./pexels-daria-shevtsova-1560932.jpg"
                      ></v-img>

                      <v-card-title>Purchasing System</v-card-title>

                      <v-card-text>
                        <v-row align="center" class="mx-0">
                          <v-rating
                            :value="4.5"
                            color="amber"
                            dense
                            half-increments
                            readonly
                            size="14"
                          ></v-rating>

                          <div class="grey--text ms-4">4.5 (413)</div>
                        </v-row>

                        <div class="my-4 text-subtitle-1">
                           Welcome
                        </div>

                        <div>
                         Web app framework base on Nuxt Js ©2021
                        </div>
                      </v-card-text>

                      <v-divider class="mx-4"></v-divider>

                      <v-card-title>By G-Innovation Co., Ltd. </v-card-title>


                    </v-card>
                  </v-row>
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
import apiService from '~/plugins/service'
const service = new apiService()
export default {
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
    async userLogin() {
      try {
        //const response = await service.userLogin(this.login)
        let response = await this.$auth.loginWith('local', { data: this.login })
        if (response.data.success) {
          this.snackbar = {
            show: true,
            text: response.data.message,
            type: 'success',
          }
          this.$router.push('/')
        } else {
          this.snackbar = {
            show: true,
            text: response.data.message,
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