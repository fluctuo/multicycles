<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-container>
      <b-navbar-toggle target="nav_collapse" />

      <b-navbar-brand :to="{name: 'index'}">
        <logo/>
      </b-navbar-brand>

      <b-collapse id="nav_collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-navbar-nav>
            <b-nav-item :to="{name: 'pricing'}" exact>Pricing</b-nav-item>
            <b-nav-item :to="{name: 'showcase'}" exact>Showcase</b-nav-item>
            <b-nav-item :to="{name: 'docs'}" exact>Documentation</b-nav-item>
          </b-navbar-nav>

          <b-nav-item-dropdown v-if="$auth.loggedIn" right class="fix-dropdown-padding">
            <template slot="button-content">
              <b-img :src="$store.state.auth.user.picture" rounded="circle" width="30" height="30" />
            </template>
            <b-dropdown-item :to="{name: 'account'}">Account</b-dropdown-item>

            <div v-if="$store.state.auth.user.roles && $store.state.auth.user.roles.includes('admin')">
              <b-dropdown-divider/>
              <b-dropdown-item :to="{name: 'admin-users'}">Users</b-dropdown-item>
              <b-dropdown-item :to="{name: 'admin-cities'}">Cities</b-dropdown-item>
            </div>
            <b-dropdown-divider/>
            <b-dropdown-item @click="logout">Sign out</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-button v-else variant="outline-primary" @click="login">
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
