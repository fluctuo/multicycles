<template>
  <div class="flex-container">
    <div class="map-container">
      <v-map ref="map" :zoom=map.zoom :center=map.center @l-moveend="moveCenter" @l-zoomend="zoomEnd" style="height: 100%">
        <v-tilelayer v-if="$store.state.lang === 'cn'" url="http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2sen-US!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965"></v-tilelayer>
        <v-tilelayer v-else url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></v-tilelayer>

        <v-marker v-if="$store.state.geolocation" :lat-lng="$store.state.geolocation" :icon="getIconByProvider('geo')" />

        <span v-for="(data, provider) in bicycles" :key="provider">
          <v-marker v-for="(bicycle, idx) in data" :lat-lng="[bicycle.lat, bicycle.lng]" :icon="getIconByProvider(provider)" :key=idx></v-marker>
        </span>
      </v-map>
    </div>
  </div>
</template>

<script>
import Vue2Leaflet from 'vue2-leaflet'
import lig from 'leaflet.icon.glyph'
import gql from 'graphql-tag'
import { mapActions } from 'vuex'

let geolocationWatcher

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180
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

export default {
  name: 'Home',
  components: {
    'v-map': Vue2Leaflet.Map,
    'v-tilelayer': Vue2Leaflet.TileLayer,
    'v-marker': Vue2Leaflet.Marker
  },
  data() {
    return {
      loading: false,
      location: {
        lat: 48.85,
        lng: 2.36
      },
      map: {
        center: [48.852775, 2.369336],
        zoom: 18
      },
      bicycles: {}
    }
  },
  created() {
    this.startGeolocation()
    this.getBicycles(this.map.center[0], this.map.center[1])
  },
  destroyed() {
    if (geolocationWatcher && navigator.geolocation) {
      navigator.geolocation.clearWatch(geolocationWatcher)
    }
  },
  watch: {
    $route: 'getBicycles'
  },
  methods: {
    ...mapActions(['getCapacities', 'setGeolocation']),
    roundLocation(l) {
      return Math.round(l * 1000) / 1000
    },
    getBicycles(lat, lng) {
      this.loading = true

      const diff = distanceInKmBetweenEarthCoordinates(this.location.lat, this.location.lng, lat, lng)

      if (diff > 0.2) {
        this.location = {
          lat: this.roundLocation(lat),
          lng: this.roundLocation(lng)
        }

        this.$apollo.queries.bicycles.refetch()
      }
    },
    startGeolocation() {
      if (!navigator.geolocation) {
        console.warn('haha navigator.geolocation doesnt exist')
      } else {
        navigator.geolocation.getCurrentPosition(position => {
          this.map.center = [position.coords.latitude, position.coords.longitude]
          this.setGeolocation(this.map.center)
          this.getBicycles(this.map.center[0], this.map.center[1])
          this.getCapacities({ lat: this.map.center[0], lng: this.map.center[1] })
        })
        geolocationWatcher = navigator.geolocation.watchPosition(position => {
          this.map.center = [position.coords.latitude, position.coords.longitude]
          this.setGeolocation(this.map.center)
          this.getBicycles(this.map.center[0], this.map.center[1])
        })
      }
    },
    zoomEnd(event) {
      this.map.zoom = this.$refs.map.mapObject.getZoom()
    },
    moveCenter(event) {
      const latlng = this.$refs.map.mapObject.getCenter()
      this.map.center = [latlng.lat, latlng.lng]
      this.getBicycles(this.map.center[0], this.map.center[1])
    },
    getIconByProvider(provider) {
      if (provider === 'geo') {
        return L.icon({
          prefix: '',
          iconUrl: '/static/glyph-marker-dot.png',
          iconSize: [24, 24]
        })
      }

      let glyph = ''
      let iconUrl = undefined

      switch (provider) {
        case 'ofo':
          glyph = 'O'
          iconUrl = '/static/glyph-marker-icon-ofo.png'
          break
        case 'gobee':
          glyph = 'G'
          iconUrl = '/static/glyph-marker-icon-gobee.png'
          break
        case 'mobike':
          glyph = 'M'
          iconUrl = '/static/glyph-marker-icon-mobike.png'
          break
        default:
          iconUrl = '/static/glyph-marker-icon.png'
          break
      }

      return L.icon.glyph({
        prefix: '',
        glyph,
        iconUrl
      })
    }
  },
  apollo: {
    bicycles() {
      return {
        query() {
          return gql`
            query($lat: Float!, $lng: Float!) {
              bicyclesByLatLng(lat: $lat, lng: $lng) {
                ${this.$store.state.providers.map(p => `${p}{ lat, lng }`).join(',')}
              }
            }
          `
        },
        variables() {
          return { lat: this.location.lat, lng: this.location.lng }
        },
        loadingKey: 'loading',
        update(data) {
          return data.bicyclesByLatLng
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../node_modules/leaflet/dist/leaflet.css';

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
  background-color: red;
  flex: 1;
}
</style>


