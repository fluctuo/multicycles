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
  updateMe(state, updated) {
    state.auth.user = Object.assign({}, state.auth.user, updated)
  },
  user(state, user) {
    state.auth.user = user
  },
  updateSubscription(state, subscription) {
    state.auth.user = Object.assign({}, state.auth.user, { subscription })
  },
  addPayementInformation(state, payementInformation) {
    state.auth.user = Object.assign({}, state.auth.user, { payementInformation })
  },
  removePayementInformation(state) {
    state.auth.user = Object.assign({}, state.auth.user, { payementInformation: null })
  }
}

export const actions = {
  nuxtServerInit({ state }, { req }) {
    state.env = this.$env
  },
  updateSubscription({ commit }, planId) {
    const client = this.app.apolloProvider.defaultClient

    return client
      .mutate({
        mutation: gql`
          mutation($planId: Int!) {
            updateSubscription(planId: $planId) {
              plan {
                id
                name
                support
              }
              limits
            }
          }
        `,
        variables: { planId }
      })
      .then(resp => commit('updateSubscription', resp.data.updateSubscription))
  },
  addPayementInformation({ commit }, stripeCardId) {
    const client = this.app.apolloProvider.defaultClient

    return client
      .mutate({
        mutation: gql`
          mutation($stripeCardId: String!) {
            addPayementInformation(stripeCardId: $stripeCardId) {
              id
              brand
              expMonth
              expYear
              last4
            }
          }
        `,
        variables: { stripeCardId }
      })
      .then(resp => commit('addPayementInformation', resp.data.addPayementInformation))
  },
  removePayementInformation({ commit }, stripeCardId) {
    const client = this.app.apolloProvider.defaultClient

    return client
      .mutate({
        mutation: gql`
          mutation($stripeCardId: String!) {
            removePayementInformation(stripeCardId: $stripeCardId) {
              id
            }
          }
        `,
        variables: { stripeCardId }
      })
      .then(resp => commit('removePayementInformation'))
  }
}
