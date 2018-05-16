<template>
  <div class="flex-container">
    <div class="map-container">
      <v-progress v-if="fetchingBicycles !== 0" />
      <l-map ref="map" :zoom=map.zoom :center=map.center @moveend="moveCenter" @dragstart="moveStart" @zoomend="zoomEnd" style="height: 100%">
        <l-tile-layer v-if="$store.state.lang === 'cn'" url="http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2sen-US!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965"></l-tile-layer >
        <l-tile-layer v-else url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}{r}.png?access_token={mapboxKey}" :options="options" :attribution="attribution"></l-tile-layer>

        <l-marker v-if="$store.state.geolocation" :lat-lng="$store.state.geolocation" :icon="getIconByProvider('geo')" />

        <span v-for="(data, provider) in bicycles" :key="provider">
          <l-marker v-for="(bicycle, idx) in data" :lat-lng="[bicycle.lat, bicycle.lng]" :icon="getIconByProvider(provider)" :key="idx"></l-marker>
        </span>
      </l-map>
      <ul class="map-ui">
        <li><a @click="centerOnGeolocation" href="#"><i data-feather="compass"></i></a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import gql from 'graphql-tag'
import { mapActions } from 'vuex'

import Progress from './Progress'

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
    LMap,
    LTileLayer,
    LMarker,
    'v-progress': Progress
  },
  data() {
    return {
      options: {
        mapboxKey: process.env.MAPBOX_KEY
      },
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      fetchingBicycles: 0,
      moved: false,
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
          this.setGeolocation([position.coords.latitude, position.coords.longitude])

          if (!this.moved) {
            this.map.center = [position.coords.latitude, position.coords.longitude]
            this.getBicycles(this.map.center[0], this.map.center[1])
          }
        })
      }
    },
    zoomEnd(event) {
      this.map.zoom = this.$refs.map.mapObject.getZoom()
    },
    moveStart() {
      this.moved = true
    },
    moveCenter(event) {
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
          iconUrl = '/static/marker-ofo.png'
          break
        case 'gobee':
          iconUrl = '/static/marker-gobee.png'
          break
        case 'mobike':
          iconUrl = '/static/marker-mobike.png'
          break
        case 'yobike':
          iconUrl = '/static/marker-yobike.png'
          break
        case 'jump':
          iconUrl = '/static/marker-jump.png'
          break
        case 'pony':
          iconUrl = '/static/marker-pony.png'
          break
        case 'lime':
          iconUrl = '/static/marker-lime.png'
          break
        case 'whitebikes':
          iconUrl = '/static/marker-whitebikes.png'
          break
        case 'obike':
          iconUrl = '/static/marker-obike.png'
          break
        case 'indigowheel':
          iconUrl = '/static/marker-indigowheel.png'
          break
        default:
          iconUrl = '/static/marker.png'
          break
      }

      return L.icon({
        iconUrl,
        iconSize: [24, 37]
      })
    },
    centerOnGeolocation() {
      const geolocation = this.$store.state.geolocation
      if (geolocation) {
        this.moved = false
        this.map.center = geolocation
      }
    }
  },
  apollo: {
    bicycles() {
      return {
        loadingKey: 'fetchingBicycles',
        query() {
          return gql`
            query($lat: Float!, $lng: Float!) {
              bicyclesByLatLng(lat: $lat, lng: $lng) {
                ${this.$store.getters.enabledProviders.map(p => `${p}{ lat, lng }`).join(',')}
              }
            }
          `
        },
        variables() {
          return { lat: this.location.lat, lng: this.location.lng }
        },
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
  flex: 1;
}

.map-ui {
  position: absolute;
  bottom: 15px;
  left: 20px;
  padding: 0;

  z-index: 1000;

  li {
    list-style: none;

    text-align: center;
    border-radius: 50%;
    line-height: 54px;
    border: 2px solid rgba(0, 0, 0, 0.2);

    background-color: #fff;

    a {
      display: block;
      height: 45px;
      width: 45px;
      font-size: 22px;
    }
  }
}
</style>


