<template>
  <b-container>
    <b-row>
      <b-col>
        <h3 class="display-4 pt-5 pb-4">Account</h3>

        <h4>Token API</h4>

        <b-row>
          <b-col>
            <div v-if="$apollo.loading" class="text-center"><img src="~/assets/loading.svg" alt="Loading..." width="80px" /></div>
            <token v-for="token in tokens" :key="token.id" :token="token" :deleteToken="deleteToken" />
          </b-col>
        </b-row>

        <b-button variant="primary" class="mt-2" @click="createToken">Create token</b-button>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import { Trash2Icon, CopyIcon } from 'vue-feather-icons'
import token from '~/components/Token.vue'

export default {
  middleware: ['auth'],
  components: {
    Trash2Icon, CopyIcon, token
  },
  data() {
    return {
      tokens: []
    }
  },
  methods: {
    createToken() {
      return this.$apollo.mutate({
        mutation: gql`mutation {
          createToken {
            value
          }
        }`
      })
      .then(() => this.$apollo.queries.tokens.refetch())
    },
    deleteToken(id) {
      return this.$apollo.mutate({
        mutation: gql`mutation ($id: Int!) {
          deleteToken (id: $id) {
            id
          }
        }`,
        variables: {
          id
        }
      })
      .then(() => this.$apollo.queries.tokens.refetch())
    }
  },
  apollo: {
    tokens: {
      query: gql`
        query {
          tokens {
            id
            value
            createdAt
          }
        }
      `,
      error(err) {
        this.$auth.logout();
      }
    }
  }
}
</script>

<style>
.token {
  padding: 3px 10px;
  word-wrap: break-word;
}
</style>
