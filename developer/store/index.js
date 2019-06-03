import gql from 'graphql-tag'
import { introspectionQuery } from 'graphql'

export const state = () => ({
  auth: undefined,
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
    state.auth = { user }
  },
  updateSubscription(state, subscription) {
    state.auth.user = Object.assign({}, state.auth.user, { subscription })
  },
  addPayementInformation(state, payementInformation) {
    state.auth.user = Object.assign({}, state.auth.user, { payementInformation })
  },
  removePayementInformation(state) {
    state.auth.user = Object.assign({}, state.auth.user, { payementInformation: null })
  },
  logout(state) {
    state.auth = undefined
    localStorage.removeItem('token')
    this.$router.replace({ path: '/login' })
  }
}

export const actions = {
  async nuxtServerInit({ state, dispatch }, { req }) {
    state.env = this.$env

    await dispatch('getSchema')
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
  },
  getSchema({ commit }) {
    const client = this.app.apolloProvider.defaultClient

    return client
      .query({
        query: gql(introspectionQuery)
      })
      .then(resp => commit('introspection', resp.data))
  },
  getMe({ commit }) {
    let client = this.app.apolloProvider.defaultClient

    return client
      .query({
        query: gql`
          query {
            me {
              userId
              name
              organization
              email
              pictureUrl
              roles
              subscription {
                plan {
                  id
                  name
                  support
                }
                limits
              }
              payementInformation {
                id
                brand
                expMonth
                expYear
                last4
              }
              usage {
                tokens
                unitsPerMonth
              }
            }
          }
        `
      })
      .then(resp => {
        if (resp.data.me) {
          commit('user', resp.data.me)
        }
      })
  },
  handleLogin({ dispatch }) {
    const [hash, token] = window.location.hash.match(/#jwt=(.*)/)

    if (hash && token) {
      localStorage.setItem('token', token)

      return dispatch('getMe')
    } else {
      return Promise.reject('no token')
    }
  },
  logout({ commit }) {
    commit('logout')
  }
}
