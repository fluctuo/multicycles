<template>
  <div>
    <b-container>
      <b-row class="mt-3">
        <b-col cols="3">
          <nuxt-link to="/docs">
            <h2>Documentation</h2>
          </nuxt-link>
          <h2>API Reference</h2>
          <ul class="list-unstyled">
            <li>
              <nuxt-link to="/api">Introduction</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/api/auth">Authentication</nuxt-link>
            </li>
          </ul>

          <h3>Queries</h3>
          <ul class="list-unstyled">
            <li v-for="query in queries(this.$store.state.introspection)" :key="query.name">
              <nuxt-link
                :to="{ name: 'api-type-value', params: { type: 'Query', value: query.name }}"
              >{{ query.name }}</nuxt-link>
            </li>
          </ul>

          <h3>Types</h3>
          <ul class="list-unstyled">
            <li v-for="t in types(this.$store.state.introspection)" :key="t.name">
              <nuxt-link
                :to="{ name: 'api-type-value', params: { type: 'Type', value: t.name }}"
              >{{ t.name }}</nuxt-link>
            </li>
          </ul>

          <h3>Enums</h3>
          <ul class="list-unstyled">
            <li v-for="t in enums(this.$store.state.introspection)" :key="t.name">
              <nuxt-link
                :to="{ name: 'api-type-value', params: { type: 'Enum', value: t.name }}"
              >{{ t.name }}</nuxt-link>
            </li>
          </ul>
        </b-col>
        <b-col cols="9">
          <nuxt-child/>
        </b-col>
      </b-row>
    </b-container>

    <Contact/>
  </div>
</template>

<script>
import { introspectionQuery } from 'graphql'
import gql from 'graphql-tag'

import Contact from '~/components/Contact.vue'

const onlyQueries = ['vehicles', 'providers']
const onlyTypes = [
  'Provider',
  'Bcycle',
  'Bird',
  'BlueBikes',
  'Byke',
  'CallABike',
  'CapitalBikeshare',
  'CitiBike',
  'Cityscoot',
  'CoGo',
  'Coup',
  'Divvy',
  'Donkey',
  'Ford',
  'GobeeBike',
  'Hellobike',
  'IndigoWheel',
  'Jump',
  'Lime',
  'Mobike',
  'Nextbike',
  'NiceRide',
  'Obike',
  'Ofo',
  'Pony',
  'SocialBicycles',
  'Spin',
  'WhiteBikes',
  'Wind',
  'Yobike'
]
const excludedEnums = ['__TypeKind', '__DirectiveLocation']

export default {
  head() {
    return {
      title: 'API references - Multicycles API',
      meta: [{ hid: 'description', name: 'description', content: 'API references for query Multicycles API.' }]
    }
  },
  components: {
    Contact
  },
  methods: {
    queries: introspection => {
      if (!introspection) {
        return []
      }

      const q = introspection.__schema && introspection.__schema.types.filter(type => type.name === 'Query')

      return Array.isArray(q) && q[0].fields.filter(f => onlyQueries.includes(f.name))
    },
    types: introspection => {
      if (!introspection) {
        return []
      }

      return (
        introspection.__schema &&
        introspection.__schema.types.filter(type => type.kind === 'OBJECT').filter(f => onlyTypes.includes(f.name))
      )
    },
    enums: introspection => {
      if (!introspection) {
        return []
      }

      return (
        introspection.__schema &&
        introspection.__schema.types.filter(type => type.kind === 'ENUM').filter(f => !excludedEnums.includes(f.name))
      )
    }
  },
  apollo: {
    introspection: {
      query: gql(introspectionQuery),
      fetchPolicy: 'cache-first',
      update(data) {
        this.$store.commit('introspection', data)
        return data
      }
    }
  }
}
</script>
