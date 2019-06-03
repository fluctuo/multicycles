<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-container>
      <b-navbar-toggle target="nav_collapse"/>

      <b-navbar-brand :to="{name: 'index'}">
        <logo/>
      </b-navbar-brand>

      <b-collapse id="nav_collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-navbar-nav>
            <b-nav-item :to="{name: 'pricing'}" exact>Pricing</b-nav-item>
            <b-nav-item :to="{name: 'showcase'}" exact>Showcase</b-nav-item>
            <b-nav-item :to="{name: 'docs'}" exact>Documentation</b-nav-item>
            <b-nav-item :to="{name: 'partners'}" exact>Partners</b-nav-item>
          </b-navbar-nav>

          <b-nav-item-dropdown v-if="isLogged" right class="fix-dropdown-padding">
            <template slot="button-content">
              <b-img
                :src="$store.state.auth.user.pictureUrl"
                rounded="circle"
                width="30"
                height="30"
              />
            </template>
            <b-dropdown-item :to="{name: 'account'}" exact>Account</b-dropdown-item>
            <b-dropdown-item :to="{name: 'account-invoices'}">Invoices</b-dropdown-item>
            <b-dropdown-item :to="{name: 'account-settings'}">Settings</b-dropdown-item>
            <b-dropdown-divider/>
            <b-dropdown-item @click="logout">Sign out</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-else :to="{name: 'login'}" variant="outline-primary" exact>Sign in</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import logo from '~/components/Logo.vue'
import { mapActions } from 'vuex'

export default {
  components: { logo },
  computed: {
    isLogged: function() {
      return this.$store.state.auth
    }
  },
  methods: mapActions(['logout'])
}
</script>

<style>
.fix-dropdown-padding a {
  padding: 5px 8px;
}
</style>
