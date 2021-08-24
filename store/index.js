import apiService from '~/plugins/service'
const service = new apiService()

export const state = () => ({
  drawer: false,
  clipped: true,
  miniVariant: true,
  supplier: [],
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
  },
  addSupplier(state, data) {
    //state.supplier.push({...data})
    state.SET_ADD_SUPPLIER(data)
  }
}
export const actions = {
  async SET_ADD_SUPPLIER(data){
    const supplier = await service.addSupplier(data)
    return supplier
  }
}