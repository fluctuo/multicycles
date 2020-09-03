import Vue from 'vue'
import Vuex from 'vuex'
import gql from 'graphql-tag'
import queryString from 'query-string'

import i18n from './i18n'
import apolloProvider from './apollo'
import getlanguage from './language'

Vue.use(Vuex)

const paris = [48.856613, 2.352222]

const disabledProviders =
  localStorage.getItem('disabledProviders') && JSON.parse(localStorage.getItem('disabledProviders'))
const position = localStorage.getItem('position') && JSON.parse(localStorage.getItem('position'))

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371

  var dLat = degreesToRadians(lat2 - lat1)
  var dLon = degreesToRadians(lon2 - lon1)

  lat1 = degreesToRadians(lat1)
  lat2 = degreesToRadians(lat2)

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

function roundLocation(l) {
  return Math.round(l * 1000) / 1000
}

const state = {
  page: 'home',
  lang: getlanguage(),
  geolocation: position || null,
  providers: [],
  disabledProviders: disabledProviders || [],
  selectedVehicle: false,
  drawerEnable: false,
  moved: false,
  map: {
    center: position || paris
  },
  selectedAddress: {
    name: ''
  },
  roundedLocation: position || paris,
  fixGPS: false,
  zones: [],
  embedded: false
}

const getters = {
  isProviderDisabled: state => provider => state.disabledProviders.includes(provider),
  enabledProviders: state => [...state.providers].filter(provider => !state.disabledProviders.includes(provider)),
  page: state => state.page,
  drawerEnable: state => state.drawerEnable,
  isEmbedded: state => state.embedded
}

const actions = {
  setLang({ commit }, event) {
    commit('setLang', event.target.value)
  },
  setGeolocation({ commit }, position) {
    commit('setGeolocation', position)
  },
  getProviders({ commit }, position = {}) {
    apolloProvider.defaultClient
      .query({
        query: gql`
          query($lat: Float, $lng: Float) {
            providers(lat: $lat, lng: $lng) {
              name
              slug
            }
          }
        `,
        variables: {
          lat: position.lat || this.state.roundedLocation[0],
          lng: position.lng || this.state.roundedLocation[1]
        }
      })
      .then(result => {
        commit('setProviders', result.data.providers)
      })
  },
  toggleProvider({ commit }, provider) {
    commit('toggleProvider', provider)
  },
  selectVehicle({ commit }, vehicle) {
    if (!vehicle) {
      commit('selectVehicle', null)
    } else if (!state.selectedVehicle || vehicle.id !== state.selectedVehicle.id) {
      commit('selectVehicle', null)
      setTimeout(() => {
        commit('selectVehicle', vehicle)
      }, 100)
    }
  },
  setDrawerEnable({ commit }, enable) {
    commit('drawerEnable', !!enable)
  },
  centerOnGeolocation({ commit }) {
    commit('centerOnGeolocation')
    commit('clearAddress')
    commit('updateLocation')
  },
  setMoved({ commit }, moved) {
    commit('setMoved', moved)
  },
  setCenter({ commit }, center) {
    commit('setCenter', center)
    commit('setRoundedLocation', center)
  },
  setAddress({ commit }, address) {
    commit('setAddress', address)
    commit('setCenter', address.position)
    commit('setRoundedLocation', address.position)
    commit('setMoved', true)
  },
  startGeolocation({ commit, state, dispatch }) {
    // request lat lng by ip
    commit('setMoved', false)

    if (state.geolocation) {
      commit('setCenter', state.geolocation)
      commit('setRoundedLocation', state.geolocation)
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        commit('fixGPS')
        dispatch('getProviders', { lat: position.coords.latitude, lng: position.coords.longitude })
        dispatch('getZones', { lat: position.coords.latitude, lng: position.coords.longitude })

        state.map.center = [position.coords.latitude, position.coords.longitude]
        state.geolocation = [position.coords.latitude, position.coords.longitude]

        commit('setRoundedLocation', [position.coords.latitude, position.coords.longitude])
      })

      navigator.geolocation.watchPosition(position => {
        state.geolocation = [position.coords.latitude, position.coords.longitude]

        if (!state.moved) {
          state.map.center = [position.coords.latitude, position.coords.longitude]
          commit('setRoundedLocation', [position.coords.latitude, position.coords.longitude])
        }
      })
    }
  },
  getZones({ commit }, position) {
    apolloProvider.defaultClient
      .query({
        query: gql`
          query($lat: Float!, $lng: Float!, $types: [ZoneType]) {
            zones(lat: $lat, lng: $lng, types: $types) {
              id
              name
              types
              geojson
              provider {
                name
                slug
              }
            }
          }
        `,
        variables: {
          ...position,
          types: ['parking', 'no_parking', 'no_ride', 'ride']
        }
      })
      .then(result => {
        commit('setZones', result.data.zones)
      })
  },
  missingProvider({ state }, provider) {
    apolloProvider.defaultClient.mutate({
      mutation: gql`
        mutation missingProvider($provider: String!, $lat: Float!, $lng: Float!) {
          missingProvider(provider: $provider, lat: $lat, lng: $lng) {
            provider
          }
        }
      `,
      variables: {
        provider,
        lat: state.roundedLocation[0],
        lng: state.roundedLocation[1]
      }
    })
  }
}

const mutations = {
  setPage(state, page) {
    state.page = page
    state.drawerEnable = page === 'home' ? false : true
  },
  setLang(state, lang) {
    localStorage.setItem('lang', lang)
    i18n.locale = lang
    state.lang = lang
  },
  setGeolocation(state, position) {
    localStorage.setItem('position', JSON.stringify(position))
    state.geolocation = position
  },
  setProviders(state, providers) {
    state.providers = providers
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
  },
  drawerEnable(state, enable) {
    state.drawerEnable = enable
  },
  centerOnGeolocation(state) {
    const geolocation = state.geolocation

    if (geolocation) {
      state.moved = false
      state.map.center = JSON.parse(JSON.stringify(geolocation))

      state.roundedLocation = [roundLocation(state.map.center[0]), roundLocation(state.map.center[1])]
    }
  },
  setMoved(state, moved) {
    state.moved = moved
  },
  setCenter(state, center) {
    state.map.center = center
  },
  setAddress(state, address) {
    state.selectedAddress = address
  },
  clearAddress(state) {
    state.selectedAddress = { name: '' }
  },
  setRoundedLocation(state, center) {
    const diff = distanceInKmBetweenEarthCoordinates(
      state.roundedLocation[0],
      state.roundedLocation[1],
      center[0],
      center[1]
    )

    if (diff > 0.2) {
      state.roundedLocation = [roundLocation(center[0]), roundLocation(center[1])]
    }
  },
  fixGPS(state) {
    state.fixGPS = true
  },
  setZones(state, zones) {
    state.zones = zones
  },
  setEmbedded(state) {
    state.embedded = true
  },
  updateLocation(state) {
    const params = {
      l: state.map.center
    }

    if (state.embedded) {
      params.embedded = true
    }

    const stringified = queryString.stringify(params)
    history.pushState(null, null, `/?${stringified}`)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
