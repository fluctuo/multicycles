import gql from 'graphql-tag'

export const state = () => ({
  selectedObject: null,
  introspection: null
})

export const actions = {
  nuxtServerInit({ commit }, context) {
    let client = context.app.apolloProvider.defaultClient

    return client
      .query({
        query: gql`
          query {
            me {
              name
              picture
              roles
              plan {
                name
                support
                limits
              }
              usage {
                tokens
                hitsPerMonth
              }
            }
          }
        `
      })
      .then(resp => {
        commit('user', resp.data.me)
      })
  }
}

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
