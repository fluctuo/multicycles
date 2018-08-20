import gql from 'graphql-tag'

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
  user(state, user) {
    state.auth.user = user
  }
}
