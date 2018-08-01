<template>
  <b-container>
    <h3 class="mt-5">Cities - {{ cities.length }}</h3>
    <b-row>
      <b-col>
        <no-ssr>
          <l-map ref="map" :zoom=map.zoom :center=map.center style="height: 400px">
            <l-tile-layer url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}{r}.png?access_token={mapboxKey}" :options="options" :attribution="attribution"></l-tile-layer>
            <l-geo-json v-for="city in cities" :geojson="city.geojson" @click="detailCity(city)" color="#ff00ff" :key="city.id"></l-geo-json>
          </l-map>
        </no-ssr>
      </b-col>
    </b-row>
    <b-row v-if="selectedCity">
      <b-col>
        {{ selectedCity.city }} {{ selectedCity.country }}
        {{ selectedCity.providers }}

        <check-city-providers :city="selectedCity" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import token from '~/components/Token.vue'
import CheckCityProviders from '~/components/CheckCityProviders.vue'

export default {
  middleware: ['auth'],
  components: {
    token,
    CheckCityProviders
  },
  data() {
    return {
      cities: [],
      selectedCity: null,
      options: {
        mapboxKey: process.env.MAPBOX_KEY
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
            providers
          }
        }
      `,
      update(data) {
        return data.cities ? JSON.parse(JSON.stringify(data.cities)) : data
      },
      error(err) {
        this.$auth.logout();
      }
    }
  },
  methods: {
    detailCity(city) {
      this.selectedCity = city
    }
  }
}
</script>
