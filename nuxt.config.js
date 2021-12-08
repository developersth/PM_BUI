import colors from 'vuetify/es5/util/colors'
let BASE_URL = (process.env.NODE_ENV === 'production')? "https://pm-bapi.herokuapp.com":"http://localhost:5000"

//let Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViIjoiYWRtaW5fZGV2IiwidXNlcm5hbWUiOiJhZG1pbl9kZXYiLCJwYXNzd29yZCI6ImFkbWluX2RldiIsImlhdCI6MTYzMDUwMTUwNX0.ly-u3KQBdiWz6RDQYHMaHCsL3pVWdL60hrAG6xj5120"
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
    baseUrl: BASE_URL
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
    '@nuxtjs/google-fonts',
  ],
  googleFonts: {
    families: {
      Kodchasan: [400, 500, 700],
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
          name: "Authorization"
          //  We don't use maxAge, because we provide expiry time for token from API
        },
        user: {
          property: "user", // The user object that API will provide us when we log in
          //autoFetch: true // if it was true will send a request to API to call the user endpoint 
        },
        endpoints: {
          login: { url: "/api/users/login", method: "post", property: "user.token" }, // our endpoint for sending request to the API
          logout: false, //  we don't have an endpoint for our logout in our API and we just remove the token from localstorage
          user: { url: "/api/users/me", method: "get" } // our endpoint for getting data from the API
        },
        redirect: {
          login: '/login'
        }
      }
    }
  },
  router: {
    middleware: ['auth']
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
