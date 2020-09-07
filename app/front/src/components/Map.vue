<template>
  <div class="flex-container">
    <div class="map-container">
      <transition name="fade">
        <img src="../assets/crosshair.svg" class="crosshair" v-if="$store.state.moved" />
      </transition>
      <v-progress v-if="fetchingVehicles" />
      <mapbox :access-token="options.mapboxKey" :map-options="mapOptions" @map-load="loaded" />
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
import mapboxgl from 'mapbox-gl' 
import Mapbox from "mapbox-gl-vue"
import { mapActions, mapState, mapMutations } from 'vuex'

import Progress from './Progress'
import SelectedVehicle from './SelectedVehicle.vue'

let mapRef = null;
let defaultZonesLayer = null;
let dataLayer = null;

let markers = {};
let markersOnScreen = {};

export default {
  name: 'Map',
  components: {
    Mapbox,
    'v-progress': Progress,
    SelectedVehicle
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
      url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={mapboxKey}',
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
    mapOptions() {
      return {
        style: "mapbox://styles/pierrickp/ck9xygbh80kp81jo4rraosg8n",
        center: [2.352222, 48.856613],
        zoom: 10,
        antialias: true,
        url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={mapboxKey}'
      }
    },
    vehiclesPerProvider : function() {
      if(!this.vehicles) {
        return {}
      }

      const vehiclesPerProvider = {}
      this.vehicles.map(v => {
        const p = v.provider

        if ( ! vehiclesPerProvider[p.slug]) {
          vehiclesPerProvider[p.slug] = {
            'GeoJSON' : {
              "type": "FeatureCollection",
              "features": []
            },
            slug: p.slug,
          }
        }

        vehiclesPerProvider[p.slug].GeoJSON.features.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [v.lng, v.lat]
          },
          "properties": {
            "vehicle": v
          }
        })
      })


      return vehiclesPerProvider
    }
  },
  watch: {
    vehicles: {
      handler() {
        this.drawData();
      }
    }
  },
  methods: {
    ...mapActions(['setGeolocation', 'selectVehicle', 'setMoved', 'setCenter']),
    ...mapMutations(['updateLocation']),
    loaded(map) {
      mapRef = map;
      //this.drawDefaultZones();
      this.drawData();
    },
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
        return ''/*
        return L.icon({
          prefix: '',
          iconUrl: '/glyph-marker-dot.png',
          iconSize: [24, 24]
        })*/
      }

      let iconUrl = `https://cdn.fluctuo.com/markers/${vehicle.provider.slug}.png`
      let iconRetinaUrl = `https://cdn.fluctuo.com/markers/${vehicle.provider.slug}-2x.png`
      
      if (vehicle.type === 'STATION' || vehicle.type === 'cluster') {
        const bgcolor = vehicle.type === 'cluster' ? '#ddf' : '#22961d'
        const textcolor = vehicle.type === 'cluster' ? '#000' : '#fff'
        return `<div style="width:24px;height:40px"><object data="${iconUrl}" type="image/png">
              <img src="https://cdn.fluctuo.com/markers/default.png">
            </object>${
            `<div class="marker-available-badge" style="  position: relative; top: -50px; right: -15px; background: ${
              !vehicle.availableVehicles ? 'grey' : bgcolor
                }; color: ${textcolor}; border-radius: 10px; width: 20px; height: 20px; text-align: center; line-height: 20px;">${
              vehicle.availableVehicles == null ? '?' : vehicle.availableVehicles
                }</div>`
          }`
      }

      return `<object data="${iconRetinaUrl}" type="image/png" width="24" height="40">
            <img src="https://cdn.fluctuo.com/markers/default-2x.png" width="24" height="40">
          </object>`
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
    drawData() {
      if ( ! mapRef ) {
        return
      }

      const vehiclesPerProvider = this.vehiclesPerProvider

      for (const slug in vehiclesPerProvider) {
        /*
        const features = vehiclesPerProvider[slug].GeoJSON.features
/*
        for (const marker of features) {
          // create a DOM element for the marker

          
          var html = this.getIconByProvider({provider:{slug:'velib'}, type:'STATION'});

          var el = document.createElement('div');
          el.innerHTML = html
          // add marker to map
          new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(mapRef);
        }
        */
        mapRef.addSource(slug, {
          'type': 'geojson',
          'data': vehiclesPerProvider[slug].GeoJSON,
          'cluster': true,
          'clusterRadius': 80
        });

        mapRef.addLayer({
          'id': `layer-${slug}`,
          'type': 'circle',
          'source': slug,
          'paint': {
            'circle-color': '#8dd3c7',
            'circle-radius': 5
          }
        });

        mapRef.on('data', (e) => {
          
          mapRef.on('moveend', () => { this.updateMarkers(e.sourceId) } );
            this.updateMarkers(e.sourceId);
          });
        
      }



      mapRef.addLayer(dataLayer);
    },
    updateMarkers(sourceId) {
      let newMarkers = {};

      if (!markersOnScreen[sourceId]) {
        markersOnScreen[sourceId] = {}
      }

      const features = mapRef.querySourceFeatures(sourceId);

      features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates;
        const props = feature.properties;
        // continue only if the point is part of a cluster
        let id, vehicle
        if ( props.cluster ) {
          id = props.cluster_id
        } else {
          vehicle = JSON.parse(props.vehicle)
          id = vehicle.id
        }

        let marker = markers[id];
        if (!marker) {
          let html // TODO offset https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker
          if (!props.cluster) {
            html = this.getIconByProvider(vehicle);
          } else {
            html = this.getIconByProvider({provider:{slug:sourceId}, type:'cluster', availableVehicles: props.point_count_abbreviated});
          }

          var el = document.createElement('div');
          el.innerHTML = html
          // create the marker object passing the html element and the coordinates
          marker = markers[id] = new mapboxgl.Marker({
            element: el
          }).setLngLat(coordinates);

        }
      
        // create an object in our newMarkers object with our current marker representing the current cluster
        newMarkers[id] = marker;

        if (!markersOnScreen[sourceId][id]) {
          marker.addTo(mapRef);
        }
      })

      // check if the marker with the cluster_id is already on the screen by iterating through our markersOnScreen object, which keeps track of that
      for (const id in markersOnScreen[sourceId]) {
        // if there isn't a new marker with that id, then it's not visible, therefore remove it. 
        if (!newMarkers[id]) {
          markersOnScreen[sourceId][id].remove();
        }
      }

      markersOnScreen[sourceId] = newMarkers
    }
  }
}
</script>
<style>
#map {
  width: 100%;
  height: 100%;
}
</style>
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
