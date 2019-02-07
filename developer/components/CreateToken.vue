<template>
  <div>
    <b-alert
      :show="dismissCountDown"
      class="mt-2 mb-2"
      fade
      dismissible
      variant="danger"
      @dismiss-count-down="countDownChanged"
    >{{ updateError }}</b-alert>

    <b-button v-b-modal.createTokenModal variant="primary" class="mt-2">Create token</b-button>

    <b-modal id="createTokenModal" title="Create token" ok-title="Create" @ok="createToken()">
      <b-form>
        <h4>Give a name to your token</h4>
        <p class="text-muted">Set a name to your token to help associate it with a project.</p>
        <b-form-group label="Token name" label-for="tokenName" description="64 chars maximum.">
          <b-form-input
            id="tokenName"
            v-model="newToken.name"
            type="text"
            required
            placeholder="token name"
            maxlength="64"
          />
        </b-form-group>

        <h4>Scopes</h4>
        <p
          class="text-muted"
        >Scopes define methods that are accessible with this token. Some scopes are sensitive and should be reserved for private tokens.
          <nuxt-link to="/docs/auth">More information</nuxt-link>
        </p>
        <b-form-group label="Public scopes">
          <b-form-checkbox-group
            v-model="newToken.scopesPublic"
            :options="availablePublicScopes"
            name="public-scopes"
          />
        </b-form-group>
        <b-form-group
          label="Private scopes"
          description="Carefull, token with private scope should not be public !"
        >
          <b-alert variant="info" show>
            Private scopes (aggregated accounts, unlock vehicles) are in beta.
            <a
              href="mailto:contact@multicycles.org"
            >Contact us</a> to participate
          </b-alert>
          <b-form-checkbox-group
            v-model="newToken.scopesPrivate"
            :options="availablePrivateScopes"
            name="private-scopes"
          />
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'CreateToken',
  props: {
    tokensCount: {
      default: null,
      type: Number
    },
    onNewToken: {
      default: null,
      type: Function
    }
  },
  data() {
    return {
      newToken: {
        name: this.tokensCount ? `Token ${this.tokensCount + 1}` : 'My token',
        scopesPublic: ['vehicles:read', 'providers:read', 'providers:login'],
        scopesPrivate: []
      },
      updateError: false,
      dismissSecs: 5,
      dismissCountDown: 0,
      availablePublicScopes: ['vehicles:read', 'providers:read', 'providers:login'],
      availablePrivateScopes: [] /* ['accounts:read', 'accounts:write', 'rides:read', 'rides.write'] */
    }
  },
  watch: {
    tokensCount: function(value) {
      this.newToken.name = value ? `Token ${value + 1}` : 'My token'
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    createToken() {
      return this.$apollo
        .mutate({
          mutation: gql`
            mutation($name: String, $scopes: [String]) {
              createToken(name: $name, scopes: $scopes) {
                name
                value
              }
            }
          `,
          variables: {
            name: this.newToken.name,
            scopes: [].concat(this.newToken.scopesPublic, this.newToken.scopesPrivate)
          }
        })
        .then(resp => {
          if (this.onNewToken) {
            return this.onNewToken()
          }
        })
        .catch(err => {
          this.dismissCountDown = this.dismissSecs
          this.updateError = err.message
        })
    }
  }
}
</script>
