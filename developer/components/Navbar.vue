<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-container>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="/">
        <logo/>
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-navbar-nav>
            <b-nav-item href="/#features" >Features</b-nav-item>
            <b-nav-item href="/#pricing" >Pricing</b-nav-item>
            <b-nav-item href="/docs" >Documentation</b-nav-item>
          </b-navbar-nav>

          <b-nav-item-dropdown right v-if="$auth && $auth.$state.loggedIn" class="fix-dropdown-padding">
            <template slot="button-content">
              <b-img :src="$auth.user.picture" rounded="circle" width="30" height="30"/>
            </template>
            <b-dropdown-item href="/account">Account</b-dropdown-item>
            <b-dropdown-item @click="logout">Sign out</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-button variant="outline-primary" v-else @click="login">
            Sign in
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import logo from '~/components/Logo.vue'

export default {
  components: { logo },
  methods: {
    login() {
      this.$auth.loginWith('auth0')
    },
    logout() {
      this.$auth.logout()
    }
  }
}
</script>

<style>
.fix-dropdown-padding a {
  padding: 5px 8px;
}
</style>
