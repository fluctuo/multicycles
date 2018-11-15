export const state = () => ({
  selectedObject: null,
  introspection: null
})

export const mutations = {
  selectObject(state, object) {
    state.selectedObject = object
  },
  introspection(state, i) {
    state.introspection = i
  },
  updateMe(state, updated) {
    state.auth.user = Object.assign({}, state.auth.user, updated)
  },
  user(state, user) {
    state.auth.user = user
  }
}

export const actions = {
  nuxtServerInit({ state }, { req }) {
    state.env = this.$env
  }
}
