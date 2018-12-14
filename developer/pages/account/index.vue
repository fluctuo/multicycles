<template>
  <b-container>
    <b-row>
      <b-col class="mb-5 pt-5">
        <h3 class="mb-4">Welcome to your account</h3>

        <h4>Plan</h4>

        <b-row>
          <b-col>
            <h5>
              Selected plan&nbsp;
              <span
                class="text-muted"
              >{{ $store.state.auth.user.subscription.plan.name }}</span>
              <nuxt-link
                v-if="$store.state.auth.user.subscription.plan.id !== 2"
                to="/account/settings"
                class="btn btn-warning"
              >Upgrade</nuxt-link>
            </h5>

            <h5>
              Units consumed this month&nbsp;
              <span
                class="text-muted"
              >{{ $store.state.auth.user.usage.unitsPerMonth }} {{ $store.state.auth.user.subscription.limits.unitsPerMonth ? ` / ${$store.state.auth.user.subscription.limits.unitsPerMonth}` : '' }}</span>
            </h5>
          </b-col>
        </b-row>

        <hr>

        <h4>API Tokens</h4>

        <b-row>
          <b-col>
            <div v-if="$apollo.loading" class="text-center">
              <img src="~/assets/loading.svg" alt="Loading..." width="80px">
            </div>
            <token
              v-for="token in tokens"
              :key="token.id"
              :token="token"
              :delete-token="deleteToken"
              :update-token="updateToken"
            />
          </b-col>
        </b-row>

        <b-alert
          :show="dismissCountDown"
          class="mt-2 mb-2"
          fade
          dismissible
          variant="danger"
          @dismiss-count-down="countDownChanged"
        >{{ updateError }}</b-alert>
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
    Trash2Icon,
    CopyIcon,
    token
  },
  data() {
    return {
      tokens: [],
      updateError: false,
      dismissSecs: 5,
      dismissCountDown: 0
    }
  },
  methods: {
    createToken() {
      return this.$apollo
        .mutate({
          mutation: gql`
            mutation($name: String) {
              createToken(name: $name) {
                name
                value
              }
            }
          `,
          variables: {
            name: `Token ${this.tokens.length + 1}`
          }
        })
        .then(resp => this.$apollo.queries.tokens.refetch())
        .catch(err => {
          this.dismissCountDown = this.dismissSecs
          this.updateError = err.message
        })
    },
    updateToken(id, updatedToken) {
      return this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!, $name: String!) {
              updateToken(id: $id, name: $name) {
                id
              }
            }
          `,
          variables: {
            id,
            name: updatedToken.name
          }
        })
        .then(() => this.$apollo.queries.tokens.refetch())
    },
    deleteToken(id) {
      return this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: Int!) {
              deleteToken(id: $id) {
                id
              }
            }
          `,
          variables: {
            id
          }
        })
        .then(() => this.$apollo.queries.tokens.refetch())
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    }
  },
  apollo: {
    tokens: {
      query: gql`
        query {
          tokens {
            id
            name
            value
            createdAt
            stats {
              date
              units
            }
          }
        }
      `,
      error(err) {
        this.$auth.logout()
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
