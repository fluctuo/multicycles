<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        Providers checker. Click on "check" button to check if this providers has vehicles in {{ city.city }}
        <div class="text-right mt-1 mb-1">
          <b-button @click="checkCity">Check</b-button>
        </div>
      </b-col>
      <b-col>
        <table class="table table-striped table-sm table-hover">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Available ?</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(status, provider) in providers" :key="provider">
              <td>{{ provider }}</td>
              <td class="text-center">
                <x-icon v-if="status === false" class="text-danger" />
                <check-icon v-else-if="status === true" class="text-success" />
                <refresh-cw-icon v-else class="text-muted" />
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import { CheckIcon, XIcon, RefreshCwIcon } from 'vue-feather-icons'

function getCentroid(coord) {
  var center = coord.reduce(
    (x, y) => {
      return [x[0] + y[0] / coord.length, x[1] + y[1] / coord.length]
    },
    [0, 0]
  )

  return center
}

export default {
  components: { CheckIcon, XIcon, RefreshCwIcon },
  props: {
    city: {
      type: Object,
      required: true
    }
  },
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

      this.$apollo
        .query({
          query: gql`
            query {
              providers {
                slug
              }
            }
          `
        })
        .then(resp => {
          const providers = {}
          resp.data.providers.forEach(provider => {
            providers[provider.slug] = undefined
          })
          this.providers = providers
          resp.data.providers.forEach(provider => {
            this.$apollo
              .query({
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
