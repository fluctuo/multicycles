<template>
  <b-modal id="editModal" :title="city.city">
    <check-city-providers :city="city" />
  </b-modal>
</template>

<script>
import CheckCityProviders from '~/components/CheckCityProviders.vue'

export default {
  props: ['city'],
  components: {
    CheckCityProviders
  }
}
</script>

