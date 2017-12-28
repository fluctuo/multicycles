<template>
  <div class="flex-container">
    <div>
      loading: {{ loading }}
    </div>
    <div class="map-container">
      <v-map ref="map" :zoom=map.zoom :center=map.center @l-moveend="moveCenter" style="height: 100%">
        <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
        <v-marker v-for="(bycycle, idx) in bycycles" :lat-lng="[bycycle.lat, bycycle.lng]" :icon="getIconByProvider(bycycle.provider)" :key=idx></v-marker>
      </v-map>
    </div>
  </div>
</template>

<script>
import Vue2Leaflet from 'vue2-leaflet'
import lig from 'leaflet.icon.glyph'

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
      map: {
        center: [48.852775, 2.369336],
        zoom: 16
      },
      bycycles: []
    }
  },
  created() {
    this.getBicycles(this.map.center[0], this.map.center[1])
  },
  watch: {
    $route: 'getBicycles'
  },
  methods: {
    getBicycles(lat /* = this.map.center[0]*/, lng /* = this.map.center[1]*/) {
      this.loading = true
      return this.axios.post('/getBicycles', { lat, lng }).then(resp => {
        this.bycycles = this.bycycles.concat(resp.data)
        this.loading = false
      })
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
      }

      return L.icon.glyph({
        prefix: '',
        glyph,
        iconUrl
      })
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


