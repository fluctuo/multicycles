<template>
  <b-container>
    <b-row>
      <b-col align="center">
        <h3 class="display-4 pt-5 pb-4">Login or sign in</h3>

        <b-btn size="lg" @click="$auth.loginWith('auth0')" variant="primary">
          <github-icon class="ajust-line" />
          Login with Github
        </b-btn>
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
  middleware: ['auth'],
  components: { GithubIcon }
}
</script>

<style>
.ajust-line {
  margin-bottom: -5px !important;
}
</style>
