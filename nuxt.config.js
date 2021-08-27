import colors from 'vuetify/es5/util/colors'
let BASE_URL = "http://ktd-dev.ddns.net:5000/"
let Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViIjoiYWRtaW5fZGV2IiwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpYXQiOjE2Mjk5NzU1MjJ9.d5iyYlbdQYgEOFZMe_Ax38gpQ9IM0VTAUwnDtM5AiHk"
export default {
  build: {
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },
  target: 'server',
  //serverMiddleware: ['~/server/index.js'],
  env: {
    baseUrl: process.env.BASE_URL||BASE_URL,
    Authorization: Authorization
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Inter Purchasing',
    title: 'Inter Purchasing',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/date-fns',

  ],
  googleFonts: {
    families: {
      Prompt: [400, 500, 700],
    }
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: BASE_URL,
  },
  auth: {
    strategies: {  // The strategies are ways that we want to implement our authentication with here we just use local strategy 
      local: { // The name of our strategy
        token: { // The token config
          property: "user.token", // The token property name that API will provide us when we log in
          global: true,   // This determines if the authentication token is automatically included in all custom axios requests.
          required: true, // This option can be used to disable all token handling.
          type: "Bearer",// Authorization header type to be used in axios requests.
          name:"Authorization"
          //  We don't use maxAge, because we provide expiry time for token from API
        },
        user: {
          property: "user", // The user object that API will provide us when we log in
          //autoFetch: true // if it was true will send a request to API to call the user endpoint 
        },
        endpoints: {
          login: { url: "/api/users/login", method: "post",property: "user.token" }, // our endpoint for sending request to the API
          logout: false, //  we don't have an endpoint for our logout in our API and we just remove the token from localstorage
          user: { url: "/api/users/me", method: "get" } // our endpoint for getting data from the API
        },
      },
    }
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
