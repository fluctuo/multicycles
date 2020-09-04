<template>
  <div class="flex-container">
    <div class="map-container">
      <transition name="fade">
        <img src="../assets/crosshair.svg" class="crosshair" v-if="$store.state.moved" />
      </transition>
      <v-progress v-if="fetchingVehicles" />
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
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={mapboxKey}"
          :options="options"
          :attribution="attribution"
        ></l-tile-layer>

        <l-marker
          v-if="$store.state.geolocation"
          :lat-lng="$store.state.geolocation"
          :icon="getIconByProvider('geo')"
        />
        <v-marker-cluster
          v-for="provider in vehiclesPerProvider"
          v-bind:key="provider.slug"
          :options="{
            showCoverageOnHover: false, 
            chunkedLoading: true, 
            maxClusterRadius: 200,
            iconCreateFunction: (cluster) => iconCreateFunction(cluster,provider)}"
        >
          <l-marker
            v-for="vehicle in provider.vehicles"
            :lat-lng="[vehicle.lat, vehicle.lng]"
            :icon="getIconByProvider(vehicle)"
            :key="vehicle.id"
            @click="selectVehicle(vehicle)"
          ></l-marker>
        </v-marker-cluster>
        <l-geo-json
          v-for="zone in selectedVehicle(zones)"
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
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import { mapActions, mapState, mapMutations } from 'vuex'

import Progress from './Progress'
import SelectedVehicle from './SelectedVehicle.vue'

export default {
  name: 'Map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson,
    'v-progress': Progress,
    SelectedVehicle,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data() {
    return {
      options: {
        mapboxKey: process.env.VUE_APP_MAPBOX_KEY,
        tileSize: 512,
        zoomOffset: -1
      },
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      location: {},
      map: {
        zoom: 17,
        minZoom: 10,
        detectRetina: true,
        options: {
          zoomControl: false,
          zoomAnimation: false
        }
      }
    }
  },
  computed: {
    ...mapState({
      center: state => state.map.center,
      excludeProviders: state => state.disabledProviders,
      roundedLocation: state => state.roundedLocation,
      zones: state => state.zones,
      vehicles: state => state.vehicles,
      fetchingVehicles: state => state.fetchingVehicles
    }),
    vehiclesPerProvider : function() {
      if(!this.vehicles) {
        return {}
      }

      const vehiclesPerProvider = {}
      this.vehicles.map(v => {
        const p = v.provider

        if ( ! vehiclesPerProvider[p.slug]) {
          vehiclesPerProvider[p.slug] = {
            slug: p.slug,
            vehicles: []
          }
        }
        
        vehiclesPerProvider[p.slug].vehicles.push(v)
      })

      return vehiclesPerProvider
    }
  },
  methods: {
    ...mapActions(['setGeolocation', 'selectVehicle', 'setMoved', 'setCenter']),
    ...mapMutations(['updateLocation']),
    zoomEnd(e) {
      const center = e.target.getCenter()
      
      this.map.zoom = this.$refs.map.mapObject.getZoom()
      
      this.setCenter([center.lat, center.lng])
      this.updateLocation()
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

      let iconUrl = `https://cdn.fluctuo.com/markers/${vehicle.provider.slug}.png`
      let iconRetinaUrl = `https://cdn.fluctuo.com/markers/${vehicle.provider.slug}-2x.png`
      
      if (vehicle.type === 'STATION') {
        return L.divIcon({
          className: 'outline-none',
          iconAnchor: [12, 40],
          html: `<div style="width:24px;height:40px"><object data="${iconUrl}" type="image/png">
              <img src="https://cdn.fluctuo.com/markers/default.png">
            </object>${
            `<div class="marker-available-badge" style="  position: relative; top: -50px; right: -15px; background: ${
              !vehicle.availableVehicles ? 'grey' : '#22961d'
                }; color: #fff; border-radius: 10px; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
              vehicle.availableVehicles == null ? '?' : vehicle.availableVehicles
                }</div>`
          }`
        })
      }

      return L.divIcon({
        className: 'outline-none',
        iconAnchor: [12, 40],
        html: `<object data="${iconRetinaUrl}" type="image/png" width="24" height="40">
              <img src="https://cdn.fluctuo.com/markers/default-2x.png" width="24" height="40">
            </object>`
      })
    },
    selectedVehicle(zones) {
      const provider = this.$store.state.selectedVehicle
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
    },
    iconCreateFunction: function (cluster, provider) {
      return this.getIconByProvider({provider,type:"STATION",availableVehicles: cluster.getChildCount()})
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

<style lang="scss">
.outline-none:focus {
  outline: none !important;
}
</style>
