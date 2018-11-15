<template>
  <b-container>
    <b-row>
      <b-col class="mb-5 pt-5">
        <h3 class="mb-4">Settings</h3>

        <b-row>
          <b-col>
            <b-card title="Profile" sub-title="Update profile details">
              <b-form class="pt-3" @submit="onSubmit" >
                <b-form-group id="fullnameInputGroup" label="Fullname:" label-for="fullnameInput">
                  <b-form-input id="fullnameInput" v-model="form.name" type="text" required placeholder="Enter fullname" />
                </b-form-group>

                <b-form-group id="organizationInputGroup" label="Organization:" label-for="organizationInput">
                  <b-form-input id="organizationInput" v-model="form.organization" type="text" placeholder="Enter organization" />
                </b-form-group>

                <b-form-group id="emailInputGroup" label="Email:" label-for="emailInput">
                  <b-form-input id="emailInput" v-model="form.email" type="email" required placeholder="Enter email" />
                </b-form-group>

                <b-alert :show="dismissCountDown" class="mt-2 mb-2" fade dismissible variant="danger" @dismiss-count-down="countDownChanged">{{ updateError }}</b-alert>
                <b-button type="submit" variant="primary">Save</b-button>
              </b-form>
            </b-card>
          </b-col>
        </b-row>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import { mapMutations } from 'vuex'

export default {
  middleware: ['auth'],
  components: {},
  data() {
    return {
      updateError: false,
      dismissSecs: 5,
      dismissCountDown: 0,
      form: {
        name: this.$store.state.auth.user.name,
        organization: this.$store.state.auth.user.organization,
        email: this.$store.state.auth.user.email
      }
    }
  },
  methods: {
    ...mapMutations(['updateMe']),
    onSubmit(e) {
      e.preventDefault()
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: String!, $name: String, $organization: String, $email: String) {
              updateUser(id: $id, name: $name, organization: $organization, email: $email) {
                name
                organization
                email
              }
            }
          `,
          variables: {
            id: this.$store.state.auth.user.userId,
            name: this.form.name,
            organization: this.form.organization,
            email: this.form.email
          }
        })
        .then(resp => {
          this.updateMe(resp.data.updateUser)
        })
        .catch(err => {
          this.dismissCountDown = this.dismissSecs
          this.updateError = err.message
        })
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    }
  }
}
</script>

<style>
</style>
