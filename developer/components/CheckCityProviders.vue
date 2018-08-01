<template>
  <b-container>
    <b-row>
      <b-col>
        <b-button @click="checkCity">Check</b-button>
      </b-col>
      <b-col>
        <ul>
          <li v-for="(status, provider) in providers" :key="provider">{{ provider }} - <x-icon v-if="status === false" class="text-danger"/><check-icon v-else-if="status === true" class="text-success"/><refresh-cw-icon v-else class="text-muted"/></li>
        </ul>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import { CheckIcon, XIcon, RefreshCwIcon } from 'vue-feather-icons'

function getCentroid(coord) {
	var center = coord.reduce((x,y) => {
		return [x[0] + y[0]/coord.length, x[1] + y[1]/coord.length]
  }, [0,0])

	return center;
}

export default {
  props: ['city'],
  components: { CheckIcon, XIcon, RefreshCwIcon },
  data() {
    return {
      providers: {}
    }
  },
  watch: {
    city: function() {
      this.providers = {}
    }
  },
  methods: {
    checkCity() {
      const center = getCentroid(this.city.geojson.coordinates[0])

      this.$apollo.query({
        query: gql`
          query {
            providers {
              slug
            }
          }
        `
      })
      .then((resp) => {
        const providers = {}
        resp.data.providers.forEach((provider) => { providers[provider.slug] = undefined })
        this.providers = providers
        resp.data.providers.forEach(provider => {
          this.$apollo.query({
            query: gql`
              query($lat: Float!, $lng: Float!) {
                ${provider.slug}(lat: $lat, lng: $lng) {
                  id
                }
              }
            `,
            variables: { lat: center[1], lng: center[0] }
          })
          .then(resp => {
            this.providers[provider.slug] = resp.data[provider.slug].length ? true : false
          })
        })
      })
    }
  }
}
</script>

