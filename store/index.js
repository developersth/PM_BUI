export const state = () => ({
    drawer: false,
    clipped:true,
    miniVariant:true,
  })
  
  export const mutations = {
    set_drawer(state, newVal) {
      state.drawer = newVal
    },
    set_clipped(state, newVal) {
        state.clipped = newVal
    },
    set_miniVariant(state, newVal) {
        state.miniVariant = newVal
    }
  }