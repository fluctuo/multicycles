import Vue from 'vue'
import Vuex from 'vuex'
import gql from 'graphql-tag'
import queryString from 'query-string'

import i18n from './i18n'
import apolloProvider from './apollo'
import getlanguage from './language'

Vue.use(Vuex)

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
  geolocation: position || [48.856613, 2.352222],
  providers: [],
  disabledProviders: disabledProviders || [],
  selectedVehicle: false,
  drawerEnable: false,
  moved: false,
  map: {
    center: position || [48.856613, 2.352222]
  },
  selectedAddress: {
    name: ''
  },
  myAccount: null,
  activeTrips: [],
  completedTrips: [],
  roundedLocation: position || [48.856613, 2.352222],
  fixGPS: false,
  zones: [],
  embedded: false,
  autoReload: false
}

const getters = {
  isProviderDisabled: state => provider => state.disabledProviders.includes(provider),
  enabledProviders: state => [...state.providers].filter(provider => !state.disabledProviders.includes(provider)),
  page: state => state.page,
  drawerEnable: state => state.drawerEnable,
  isEmbedded: state => state.embedded,
  hasSeamlessSubaccount: state => provider =>
    state.myAccount && state.myAccount.subAccounts.find(sub => sub.provider.slug === provider)
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
  refreshSelectedVehicle({ commit, dispatch }, vehicle) {
    return dispatch('getVehicle', {
      id: vehicle.id,
      lat: vehicle.lat,
      lng: vehicle.lng
    }).then(vehicle => {
      if (vehicle && state.selectedVehicle && vehicle.id === state.selectedVehicle.id) {
        commit('selectVehicle', vehicle)
      }
    })
  },
  selectVehicle({ commit, dispatch }, vehicle, { refresh = true } = {}) {
    if (!vehicle) {
      commit('selectVehicle', null)
    } else if (!state.selectedVehicle || vehicle.id === state.selectedVehicle.id) {
      commit('selectVehicle', vehicle)
      if (refresh) {
        dispatch('refreshSelectedVehicle', vehicle)
      }
    } else {
      commit('selectVehicle', null)
      setTimeout(() => {
        commit('selectVehicle', vehicle)
        if (refresh) {
          dispatch('refreshSelectedVehicle', vehicle)
        }
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
  login({ dispatch }) {
    if (localStorage.getItem('token')) {
      return apolloProvider.defaultClient
        .query({
          fetchPolicy: 'no-cache',
          query: gql`
            query {
              getMyAccount
            }
          `
        })
        .then(() => dispatch('getMyAccount'))
        .then(() => dispatch('getActiveTrips'))
        .then(() => dispatch('getCompletedTrips'))
    }
  },
  getMyAccount({ commit }) {
    return apolloProvider.defaultClient
      .query({
        fetchPolicy: 'no-cache',
        query: gql`
          query {
            getMyAccount
          }
        `
      })
      .then(result => {
        commit('setMyAccount', result.data.getMyAccount)
      })
  },
  getActiveTrips({ commit }) {
    if (!localStorage.getItem('token')) {
      return
    }

    return apolloProvider.defaultClient
      .query({
        fetchPolicy: 'no-cache',
        query: gql`
          query {
            getMyActiveTrips
          }
        `
      })
      .then(result => {
        commit('setActiveTrips', result.data.getMyActiveTrips)
      })
  },
  getCompletedTrips({ commit }) {
    if (!localStorage.getItem('token')) {
      return
    }

    return apolloProvider.defaultClient
      .query({
        fetchPolicy: 'no-cache',
        query: gql`
          query {
            getMyCompletedTrips
          }
        `
      })
      .then(result => {
        commit('setCompletedTrips', result.data.getMyCompletedTrips)
      })
  },
  getVehicle(unused, { provider, code, id, lat, lng }) {
    return apolloProvider.defaultClient
      .query({
        fetchPolicy: 'no-cache',
        query: gql`
          query($id: String, $code: String, $provider: String, $lat: Float!, $lng: Float!) {
            vehicle(id: $id, code: $code, provider: $provider, lat: $lat, lng: $lng) {
              id
              lat
              lng
              type
              publicId
              attributes
              propulsion
              battery
              actions {
                unlock {
                  available
                  metadata
                }
              }
              provider {
                name
                slug
                website
                discountCode
                app {
                  android
                  ios
                }
                deepLink {
                  android
                  ios
                }
                stationVehicleTypes
              }
              pricing {
                currency
                unlock
                perKm {
                  start
                  interval
                  price
                }
                perMin {
                  start
                  interval
                  price
                }
                perMinPause {
                  start
                  interval
                  price
                }
                includeVat
              }
              ... on Station {
                availableVehicles
                availableStands
                isVirtual
                stationVehicleDetails {
                  vehicleType
                  propulsion
                  availableVehicles
                }
              }
              ... on Car {
                carClass
                carModel
              }
            }
          }
        `,
        variables: { provider, code, id, lat, lng }
      })
      .then(result => result?.data?.vehicle)
  },
  async startMyTrip({ commit }, { vehicle }) {
    if (!localStorage.getItem('token')) {
      return
    }

    if (!vehicle?.actions?.unlock?.available) {
      return
    }

    const { message, trip, paymentIntent } = await apolloProvider.defaultClient
      .mutate({
        mutation: gql`
          mutation($provider: String!, $metadata: String!, $vehicleId: String!, $lat: Float!, $lng: Float!) {
            startMyTrip(provider: $provider, metadata: $metadata, vehicleId: $vehicleId, lat: $lat, lng: $lng)
          }
        `,
        variables: {
          vehicleId: vehicle.id,
          provider: vehicle.provider.slug,
          metadata: vehicle.actions.unlock.metadata,
          lat: vehicle.lat,
          lng: vehicle.lng
        }
      })
      .then(result => result?.data?.startMyTrip)

    if (message && message.type === 'error' && !paymentIntent && !trip) {
      throw new Error(message.text)
    }

    if (paymentIntent?.status === 'requires_action') {
      throw { paymentIntent }
    }

    if (trip) {
      commit('setActiveTrips', [trip])
    }
  },
  stopMyTrip({ state }, { tripId, provider }) {
    if (!localStorage.getItem('token')) {
      return
    }

    return apolloProvider.defaultClient
      .mutate({
        mutation: gql`
          mutation($tripId: String!, $provider: String!, $lat: Float!, $lng: Float!) {
            stopMyTrip(tripId: $tripId, provider: $provider, lat: $lat, lng: $lng)
          }
        `,
        variables: {
          tripId,
          provider,
          lat: state.geolocation[0],
          lng: state.geolocation[1]
        }
      })
      .then(result => result.data.stopMyTrip)
  },
  startGeolocation({ commit, state, dispatch }) {
    // request lat lng by ip
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        commit('fixGPS')
        dispatch('getProviders', { lat: position.coords.latitude, lng: position.coords.longitude })
        dispatch('getZones', { lat: position.coords.latitude, lng: position.coords.longitude })

        if (!state.moved) {
          state.map.center = [position.coords.latitude, position.coords.longitude]
          state.geolocation = [position.coords.latitude, position.coords.longitude]

          commit('setRoundedLocation', [position.coords.latitude, position.coords.longitude])
        }
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
        lat: state.geolocation[0],
        lng: state.geolocation[1]
      }
    })
  },
  createSubAccount({ dispatch }, { provider }) {
    return apolloProvider.defaultClient
      .mutate({
        fetchPolicy: 'no-cache',
        mutation: gql`
          mutation($provider: String!) {
            createSubAccount(provider: $provider)
          }
        `,
        variables: {
          provider
        }
      })
      .then(() => dispatch('getMyAccount'))
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
  setMyAccount(state, myAccount) {
    Vue.set(state, 'myAccount', myAccount)
  },
  setActiveTrips(state, trips) {
    state.activeTrips = trips
  },
  setCompletedTrips(state, trips) {
    state.completedTrips = trips
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
  setAutoReload(state) {
    state.autoReload = true
  },
  updateLocation(state) {
    const params = {
      l: state.map.center
    }

    if (state.embedded) {
      params.embedded = true
    }

    if (state.autoReload) {
      params.autoReload = true
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
