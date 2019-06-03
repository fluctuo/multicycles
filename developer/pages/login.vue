<template>
  <b-container>
    <b-row>
      <b-col align="center">
        <h3 class="display-4 pt-5 pb-4">Login or sign in</h3>
      </b-col>
    </b-row>

    <b-row>
      <b-col align="center">
        <b-btn size="lg" variant="primary" @click="loginWith('github')">
          <github-icon class="ajust-line"/>Login with Github
        </b-btn>

        <b-btn size="lg" variant="primary" @click="loginWith('google')">Login with Google</b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<style scoped>
.login-button {
  border: 0;
}
</style>

<script>
import { GithubIcon } from 'vue-feather-icons'

export default {
  components: { GithubIcon },
  methods: {
    loginWith(provider) {
      window.location.href = `${this.$env.MULTICYCLES_API}/auth/${provider}?returnTo=${this.$env.BASE_URL}/callback`
    }
  }
}
</script>

<style>
.ajust-line {
  margin-bottom: -5px !important;
}
</style>
