<template>
  <b-container>
    <h3 class="mt-5">Saved cities - {{ cities.length }} in total</h3>
    <b-row>
      <b-col>
        <no-ssr>
          <l-map ref="map" :zoom="map.zoom" :center="map.center" style="height: 400px">
            <l-tile-layer :options="options" :attribution="attribution" url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}{r}.png?access_token={mapboxKey}" />
            <l-geo-json v-for="city in cities" :geojson="city.geojson" :key="city.id" color="#ff00ff" @click="detailCity(city)" />
          </l-map>
        </no-ssr>
      </b-col>

    </b-row>

    <b-row v-if="selectedCity" class="mt-5 mb-5">
      <b-col>
        <h4>{{ selectedCity.city }}
          <span class="text-muted">- {{ selectedCity.country }}</span>
        </h4>
        <city-edit :city="selectedCity"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import token from '~/components/Token.vue'
import CityEdit from '~/components/CityEdit.vue'

export default {
  middleware: ['auth'],
  components: {
    token,
    CityEdit
  },
  data() {
    return {
      cities: [],
      selectedCity: null,
      options: {
        mapboxKey: this.$env.MAPBOX_KEY
      },
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      map: {
        zoom: 4,
        center: [48.69, 9.14],
        detectRetina: true
      }
    }
  },
  apollo: {
    cities: {
      query: gql`
        query {
          cities {
            id
            city
            country
            geojson
            providers {
              slug
              source
            }
          }
        }
      `,
      update(data) {
        const cities = data.cities ? JSON.parse(JSON.stringify(data.cities)) : data

        if (this.$route.params && this.$route.params.city) {
          this.selectedCity = cities.find(c => c.id === parseInt(this.$route.params.city, 10))
        }

        return cities
      },
      error(err) {
        this.$auth.logout()
      }
    }
  },
  methods: {
    detailCity(city) {
      window.history.pushState({}, '', `/admin/cities/${city.id}`)
      this.selectedCity = this.cities.find(c => c.id === city.id)
    }
  }
}
</script>
