<template>
  <div class="flex-container">
    <div class="map-container">
      <v-map ref="map" :zoom=map.zoom :center=map.center @l-moveend="moveCenter" @l-zoomend="zoomEnd" style="height: 100%">
        <v-tilelayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></v-tilelayer>
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
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
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
        zoom: 17
      },
      bicycles: {}
    }
  },
  created() {
    this.setCenter()
    this.getBicycles(this.map.center[0], this.map.center[1])
  },
  watch: {
    $route: 'getBicycles'
  },
  methods: {
    roundLocation(l) {
      return Math.round(l * 1000) / 1000
    },
    getBicycles(lat, lng) {
      this.loading = true

      const diff = distanceInKmBetweenEarthCoordinates(
        this.location.lat,
        this.location.lng,
        lat,
        lng
      )

      if (diff > 0.5) {
        this.location = {
          lat: this.roundLocation(lat),
          lng: this.roundLocation(lng)
        }

        this.$apollo.queries.bicycles.refetch()
      }
    },
    setCenter() {
      if (!navigator.geolocation) {
        console.warn('haha navigator.geolocation doesnt exist')
      } else {
        navigator.geolocation.getCurrentPosition(position => {
          this.map.center = [
            position.coords.latitude,
            position.coords.longitude
          ]
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
        query: gql`
          query($lat: Float!, $lng: Float!) {
            bicyclesByLatLng(lat: $lat, lng: $lng) {
              gobee {
                lat
                lng
              }
              ofo {
                lat
                lng
              }
              mobike {
                lat
                lng
              }
            }
          }
        `,
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


