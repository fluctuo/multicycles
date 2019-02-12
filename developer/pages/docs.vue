<template>
  <div>
    <b-container fluid>
      <b-row class="mt-3">
        <b-col md="2">
          <b-button
            variant="primary"
            class="d-block d-sm-none w-100"
            @click="showMenu = !showMenu"
          >Menu Documentation</b-button>
          <div id="docsCollapse" :class="{ 'd-none': showMenu, 'd-sm-block': showMenu }">
            <h2>Documentation</h2>
            <ul class="list-unstyled">
              <li>
                <nuxt-link to="/docs">Introduction</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/docs/auth">Auhentication</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/docs/providers">Providers</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/docs/objects">Objects</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/docs/accounts">Accounts</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/docs/subaccount">Subaccount</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/docs/rides">Rides</nuxt-link>
              </li>
              <li>
                <nuxt-link to="/docs/limits">Units & Limits</nuxt-link>
              </li>
            </ul>
            <nuxt-link to="/api">
              <h2>API Reference</h2>
            </nuxt-link>
          </div>
        </b-col>
        <b-col md="9" class="documentation">
          <nuxt-child/>
        </b-col>
      </b-row>
    </b-container>

    <Contact/>
  </div>
</template>

<script>
import Contact from '~/components/Contact.vue'

export default {
  head() {
    return {
      title: 'Documentions - Multicycles API',
      meta: [{ hid: 'description', name: 'description', content: 'Documentation for Multicycles API.' }]
    }
  },
  components: {
    Contact
  },
  data() {
    return {
      showMenu: true
    }
  }
}
</script>

<style lang="scss" scoped>
#docsCollapse.visible {
  display: none;
}

@media (min-width: 768px) {
  #docsCollapse.visible {
    display: block;
  }
}
</style>
