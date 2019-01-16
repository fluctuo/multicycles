<template>
  <div>
    <b-container>
      <b-row class="mt-3">
        <b-col cols="3">
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
              <nuxt-link to="/docs/limits">Units & Limits</nuxt-link>
            </li>
          </ul>
          <nuxt-link to="/api">
            <h2>API Reference</h2>
          </nuxt-link>
        </b-col>
        <b-col cols="9" class="documentation">
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
  }
}
</script>
