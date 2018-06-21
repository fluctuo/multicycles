<template>
    <b-container>
      <b-row class="mt-3">
        <b-col cols="3">
          <ul class="list-unstyled">
            <li><nuxt-link to="/docs">Introduction</nuxt-link></li>
            <li><nuxt-link to="/docs/auth">Authentication</nuxt-link></li>
          </ul>

          <h4>Queries</h4>
          <ul class="list-unstyled">
            <li v-for="query in queries(this.$store.state.introspection)" :key="query.name">
              <nuxt-link :to="{ name: 'docs-type-value', params: { type: 'Query', value: query.name }}">{{ query.name }}</nuxt-link>
            </li>
          </ul>

          <h4>Types</h4>
          <ul class="list-unstyled">
            <li v-for="t in types(this.$store.state.introspection)" :key="t.name">
              <nuxt-link :to="{ name: 'docs-type-value', params: { type: 'Type', value: t.name }}">{{ t.name }}</nuxt-link>
            </li>
          </ul>

          <h4>Enums</h4>
          <ul class="list-unstyled">
            <li v-for="t in enums(this.$store.state.introspection)" :key="t.name">
              <nuxt-link :to="{ name: 'docs-type-value', params: { type: 'Enum', value: t.name }}">{{ t.name }}</nuxt-link>
            </li>
          </ul>
        </b-col>
        <b-col cols="9">
          <nuxt-child />
        </b-col>
      </b-row>
    </b-container>
</template>

<script>

import { introspectionQuery } from 'graphql'
import gql from 'graphql-tag';

const onlyQueries = ['vehicles', 'providers']
const excludedTypes = ['App', 'Query', '__Schema', '__Type', '__Field', '__InputValue', '__EnumValue', '__Directive', 'Token', 'DeletedToken', 'Mutation']
const excludedEnums = ['__TypeKind', '__DirectiveLocation']

export default {
  methods: {
    queries: (introspection) => {
      if (!introspection) {
        return []
      }

      const q = introspection.__schema && introspection.__schema.types.filter((type) => type.name === 'Query');

      return Array.isArray(q) && q[0].fields.filter((f) => onlyQueries.includes(f.name))
    },
    types: (introspection) => {
      if (!introspection) {
        return []
      }

      return introspection.__schema && introspection.__schema.types.filter((type) => type.kind === 'OBJECT').filter((f) => !excludedTypes.includes(f.name));
    },
    enums: (introspection) => {
      if (!introspection) {
        return []
      }

      return introspection.__schema && introspection.__schema.types.filter((type) => type.kind === 'ENUM').filter((f) => !excludedEnums.includes(f.name));
    }
  },
  apollo: {
    introspection: {
      query: gql(introspectionQuery),
      update(data) {
        this.$store.commit('introspection', data)
        return data
      }
    }
  }
}
</script>
