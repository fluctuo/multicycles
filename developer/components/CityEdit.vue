<template>
  <b-container>
    <b-row>
      <b-col>
        <table class="table table-striped table-sm table-sm table-hover">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Source</th>
              <th class="text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(provider, index) in providers" :key="provider.slug">
              <td>{{ provider.slug }}</td>
              <td><input v-model="provider.source" type="text"></td>
              <td class="text-center">
                <a @click="removeProvider(index)">
                  <x-icon class="text-danger" />
                </a>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <input v-model="providerToAdd" type="text">
              </td>
              <td class="text-center">
                <b-btn variant="warning" size="sm" @click="addProvider(providerToAdd)">Add</b-btn>
              </td>
            </tr>
          </tfoot>
        </table>
        <b-alert :show="dismissCountDown" fade dismissible variant="danger" @dismiss-count-down="countDownChanged">{{ updateError }} {{ dismissCountDown }}</b-alert>
        <div class="text-right">
          <b-btn :disabled="isUpdating" variant="success" @click="update">Update</b-btn>
        </div>
      </b-col>
      <b-col>
        <check-city-providers :city="city" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import { XIcon } from 'vue-feather-icons'

import CheckCityProviders from '~/components/CheckCityProviders.vue'

export default {
  components: {
    XIcon,
    CheckCityProviders
  },
  props: {
    city: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      providers: [...this.city.providers],
      providerToAdd: '',
      isUpdating: false,
      updateError: false,
      dismissSecs: 5,
      dismissCountDown: 0
    }
  },
  watch: {
    city: function() {
      this.providers = [...this.city.providers]
    }
  },
  methods: {
    update() {
      this.isUpdating = true
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!, $providers: [ProviderSourcesInput]!) {
              updateCity(id: $id, providers: $providers) {
                id
                providers {
                  slug
                  source
                }
              }
            }
          `,
          variables: {
            id: this.city.id,
            providers: this.providers.map(({ slug, source }) => ({ slug, source }))
          }
        })
        .then(resp => {
          this.isUpdating = false
          this.city.providers = resp.data.updateCity.providers
        })
        .catch(err => {
          this.isUpdating = false
          this.dismissCountDown = this.dismissSecs
          this.updateError = err.message
        })
    },
    addProvider() {
      this.providers.push({ slug: this.providerToAdd, source: 'default' })
      this.providerToAdd = ''
    },
    removeProvider(index) {
      this.providers.splice(index, 1)
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    }
  }
}
</script>
