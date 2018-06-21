import Vue from 'vue'
import Vuex from 'vuex'
import gql from 'graphql-tag'

import i18n from './i18n'
import apolloProvider from './apollo'

Vue.use(Vuex)

const capacities = localStorage.getItem('capacities') && JSON.parse(localStorage.getItem('capacities'))
const disabledProviders =
  localStorage.getItem('disabledProviders') && JSON.parse(localStorage.getItem('disabledProviders'))

const state = {
  lang: localStorage.getItem('lang') || (capacities && capacities.defaultLanguage) || 'en',
  settingPanel: false,
  geolocation: false,
  providers: (capacities && capacities.providers) || [
    'bird',
    'byke',
    'donkey',
    'gobeebike',
    'indigowheel',
    'jump',
    'lime',
    'mobike',
    'obike',
    'ofo',
    'pony',
    'whitebikes',
    'yobike'
  ],
  disabledProviders: disabledProviders || [],
  selectedVehicle: false
}

const getters = {
  isProviderDisabled: state => provider => state.disabledProviders.includes(provider),
  enabledProviders: state => [...state.providers].filter(provider => !state.disabledProviders.includes(provider))
}

const actions = {
  toggleSettingPanel({ commit }) {
    commit('toggleSettingPanel')
  },
  setLang({ commit }, event) {
    commit('setLang', event.target.value)
  },
  setGeolocation({ commit }, position) {
    commit('setGeolocation', position)
  },
  getCapacities({ state, commit }, position) {
    if (state.geolocation) {
      apolloProvider.defaultClient
        .query({
          query: gql`
            query($lat: Float!, $lng: Float!) {
              capacities(lat: $lat, lng: $lng) {
                defaultLanguage
                providers
              }
            }
          `,
          variables: {
            lat: state.geolocation[0],
            lng: state.geolocation[1]
          }
        })
        .then(result => {
          commit('setCapacities', result.data.capacities)
        })
    }
  },
  toggleProvider({ commit }, provider) {
    commit('toggleProvider', provider)
  },
  selectVehicle({ commit }, vehicle) {
    commit('selectVehicle', vehicle)
  }
}

const mutations = {
  toggleSettingPanel(state) {
    state.settingPanel = !state.settingPanel
  },
  setLang(state, lang) {
    localStorage.setItem('lang', lang)
    i18n.locale = lang
    state.lang = lang
  },
  setGeolocation(state, position) {
    state.geolocation = position
  },
  setCapacities(state, capacities) {
    localStorage.setItem('capacities', JSON.stringify(capacities))

    if (!localStorage.getItem('lang')) {
      i18n.locale = capacities.defaultLanguage
    }

    state.providers = capacities.providers
  },
  toggleProvider(state, provider) {
    if (state.disabledProviders.includes(provider)) {
      state.disabledProviders.splice(state.disabledProviders.indexOf(provider), 1)
    } else {
      state.disabledProviders.push(provider)
    }

    localStorage.setItem('disabledProviders', JSON.stringify(state.disabledProviders))
  },
  selectVehicle(state, vehicle) {
    state.selectedVehicle = vehicle
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
