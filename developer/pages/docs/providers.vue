<template>
  <div>
    <h3>Providers</h3>

    <p>
      <nuxt-link to="/">Open-API</nuxt-link> implements many shared vehicle providers, such as bicycles with Mobike or Ofo, scooters with Bird and Lime, as well as scooters and cars.<br>
      A city does not include all providers.
      It may be interesting to ask the API which providers are available in the city.
    </p>

    <simple-providers class="mt-4 mb-4" />

    <all-providers class="mt-4 mb-4" />

    <p>
      Continue with <nuxt-link to="/docs/objects">Objects</nuxt-link>.
    </p>
  </div>
</template>

<script>
import SimpleProviders from '~/components/docs/playground/simpleProviders.vue'
import AllProviders from '~/components/docs/playground/allProviders.vue'
export default {
  components: { SimpleProviders, AllProviders },
  head() {
    return {
      title: 'Documentation - Providers - Open-API by Multicycles',
      meta: [{ hid: 'description', name: 'description', content: 'Get available providers with Open-API API.' }]
    }
  }
}
</script>
