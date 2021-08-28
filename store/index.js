import apiService from '~/plugins/service'
const service = new apiService()

export const state = () => ({
  drawer: false,
  clipped: true,
  miniVariant: true,
  supplier: [],
  errors: null,
  success: null,
  userProfileInfo: null,
  user: {
    loggedIn: false,
  }
})
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },
  isAdmin(state) {
    try {
      const type = state.auth.user.type
      if (type === 'admin')
        return true
      else
        return false
    } catch (error) {
      return false
    }

  },
  isName(state) {
      return state.auth.user.name
  },
}
export const mutations = {
  set_drawer(state, newVal) {
    state.drawer = newVal
  },
  set_clipped(state, newVal) {
    state.clipped = newVal
  },
  set_miniVariant(state, newVal) {
    state.miniVariant = newVal
  },
  hasError(state, payload) {
    state.errors = null
    state.errors = payload
  },
  hasSuccess(state, message) {
    state.success = null
    state.success = message
  },
  //Users
  set_log_in(state, newVal) {
    state.user.loggedIn = newVal
  },

}
export const actions = {
  async onLogin(context, userData) {
    try {
      const response = await this.$auth.loginWith('local', {
        data: userData,
      })
      console.log(response.data)
      await context.commit('hasSuccess', response.data.message)
    } catch (error) {
      console.log(error)
    }
  }
}