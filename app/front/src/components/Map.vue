<template>
  <div class="flex-container">
    <div class="map-container">
      <transition name="fade">
        <img src="../assets/crosshair.svg" class="crosshair" v-if="$store.state.moved" />
      </transition>
      <v-progress v-if="fetchingVehicles !== 0" />
      <l-map
        ref="map"
        :zoom="map.zoom"
        :minZoom="map.minZoom"
        :center="center"
        @dragend="moveEnd"
        @dragstart="moveStart"
        @zoomend="zoomEnd"
        :options="map.options"
        style="height: 100%"
      >
        <l-tile-layer
          v-if="$store.state.lang === 'cn'"
          url="http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2sen-US!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965"
        ></l-tile-layer>
        <l-tile-layer
          v-else
          url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}{r}.png?access_token={mapboxKey}"
          :options="options"
          :attribution="attribution"
        ></l-tile-layer>

        <l-marker
          v-if="$store.state.geolocation"
          :lat-lng="$store.state.geolocation"
          :icon="getIconByProvider('geo')"
        />

        <l-marker
          v-for="vehicle in vehicles"
          :lat-lng="[vehicle.lat, vehicle.lng]"
          :icon="getIconByProvider(vehicle)"
          :key="vehicle.id"
          @click="selectVehicle(vehicle)"
        ></l-marker>

        <l-geo-json
          v-for="zone in activeRideOrSelectedVehicle(zones)"
          :geojson="zone.geojson"
          :key="zone.id"
          :options="getZoneStyle(zone.types)"
        >
          <l-popup>Hello!</l-popup>
        </l-geo-json>
      </l-map>
      <transition
        name="custom-classes-transition"
        enter-active-class="fadeInUp"
        leave-active-class="fadeOutDown"
      >
        <selected-vehicle
          v-if="$store.state.selectedVehicle"
          :vehicle="$store.state.selectedVehicle"
        ></selected-vehicle>
      </transition>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LGeoJson } from 'vue2-leaflet'
import gql from 'graphql-tag'
import { mapActions, mapState, mapMutations } from 'vuex'

import Progress from './Progress'
import SelectedVehicle from './SelectedVehicle.vue'

let autoReloadInterval

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson,
    'v-progress': Progress,
    SelectedVehicle
  },
  mounted() {
    if (this.autoReloadEnabled) {
      autoReloadInterval = setInterval(() => {
        this.reloadVehicules()
      }, 2 * 60 * 1000)
    }
  },
  beforeDestroy() {
    if (autoReloadInterval) {
      clearInterval(autoReloadInterval)
    }
  },
  data() {
    return {
      options: {
        mapboxKey: process.env.VUE_APP_MAPBOX_KEY
      },
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      fetchingVehicles: 0,
      location: {
        lat: this.$store.state.geolocation[0],
        lng: this.$store.state.geolocation[1]
      },
      map: {
        zoom: 17,
        minZoom: 13,
        detectRetina: true,
        options: {
          zoomControl: false
        }
      },
      vehicles: []
    }
  },
  computed: mapState({
    hasActiveRides: state => !!(state.activeRides && state.activeRides.length),
    center: state => state.map.center,
    excludeProviders: state => state.disabledProviders,
    roundedLocation: state => state.roundedLocation,
    zones: state => state.zones,
    autoReloadEnabled: state => state.autoReload
  }),
  watch: {
    $route: 'reloadVehicules'
  },
  methods: {
    ...mapActions(['setGeolocation', 'selectVehicle', 'setMoved', 'setCenter']),
    ...mapMutations(['updateLocation']),
    zoomEnd() {
      this.map.zoom = this.$refs.map.mapObject.getZoom()
    },
    moveStart() {
      if (this.$store.state.selectedVehicle) {
        this.selectVehicle(false)
      }

      if (!this.$store.state.moved) {
        this.setMoved(true)
      }
    },
    moveEnd(e) {
      const center = e.target.getCenter()

      this.setCenter([center.lat, center.lng])
      this.updateLocation()
    },
    getIconByProvider(vehicle) {
      if (vehicle === 'geo') {
        return L.icon({
          prefix: '',
          iconUrl: '/glyph-marker-dot.png',
          iconSize: [24, 24]
        })
      }

      let iconUrl
      let iconRetinaUrl

      if (process.env.NODE_ENV !== 'production') {
        try {
          iconUrl = require(`../../../../graphics/assets/markers/${vehicle.provider.slug}.png`)
          iconRetinaUrl = require(`../../../../graphics/assets/markers/${vehicle.provider.slug}-2x.png`)
        } catch (e) {
          iconUrl = require(`../../../../graphics/assets/markers/default.png`)
          iconRetinaUrl = require(`../../../../graphics/assets/markers/default-2x.png`)
        }
      } else {
        iconUrl = `https://cdn.fluctuo.com/markers/${vehicle.provider.slug}.png`
        iconRetinaUrl = `https://cdn.fluctuo.com/markers/${vehicle.provider.slug}-2x.png`
      }

      if (vehicle.type === 'STATION') {
        return L.divIcon({
          className: null,
          html: `<div><img src="${iconUrl}" />${
            `<div class="marker-available-badge" style="  position: relative; top: -50px; right: -15px; background: ${
              !vehicle.availableVehicles ? 'grey' : '#22961d'
                }; color: #fff; border-radius: 10px; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
              vehicle.availableVehicles == null ? '?' : vehicle.availableVehicles
                }</div>`
          }`
        })
      }

      return L.icon({
        iconUrl,
        iconRetinaUrl,
        iconSize: [24, 40]
      })
    },
    reloadVehicules() {
      this.$apollo.queries.vehicles.refetch()
    },
    activeRideOrSelectedVehicle(zones) {
      const provider = this.hasActiveRides
        ? this.$store.state.activeRides[0].provider.slug
        : this.$store.state.selectedVehicle
        ? this.$store.state.selectedVehicle.provider.slug
        : null

      return provider ? zones.filter(z => z.provider.slug === provider) : []
    },
    getZoneStyle(types) {
      let color

      if (types.indexOf('no_parking') > -1 || types.indexOf('no_ride') > -1) {
        color = '#f44336'
      } else if (types.indexOf('ride') > -1) {
        color = '#c8e6c9'
      } else if (types.indexOf('parking') > -1) {
        color = '#4caf50'
      }

      return {
        style: { color }
      }
    }
  },
  apollo: {
    vehicles() {
      return {
        loadingKey: 'fetchingVehicles',
        query() {
          return gql`
            query($lat: Float!, $lng: Float!, $excludeProviders: [String]) {
              vehicles(lat: $lat, lng: $lng, excludeProviders: $excludeProviders) {
                id
                lat
                lng
                type
                attributes
                battery
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
                }
                ... on Station {
                  availableVehicles
                  availableStands
                  isVirtual
                }
              }
            }
          `
        },
        variables() {
          return { lat: this.roundedLocation[0], lng: this.roundedLocation[1], excludeProviders: this.excludeProviders }
        },
        update(data) {
          return data.vehicles ? data.vehicles : []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: stretch;
}

.map-container {
  flex: 1;
  width: 100%;
}

.crosshair {
  $crosshairsize: 28px;

  position: absolute;
  z-index: 401;
  width: $crosshairsize;
  top: 50%;
  left: 50%;
  margin-top: ($crosshairsize / 2) * -1;
  margin-left: ($crosshairsize / 2) * -1;
}

.leaflet-bottom {
  z-index: 800 !important;
}

.leaflet-div-icon {
  background: none !important;
  border: none !important;
}

.marker-available-badge {
  position: relative;
  top: -48px;
  right: -20px;
  background: white;
  border-radius: 50px;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
}
</style>
