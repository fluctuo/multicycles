<template>
  <div>
    <h3>Objects</h3>

    <p>Objects refer to vehicles (bike, cars, etc.) but also to stations (virtual or not)
      <br>For historical reasons, it is necessary to use the
      <nuxt-link :to="{name: 'api-type-value', params: {type: 'Query', value: 'vehicles'}}">vehicles</nuxt-link>query.
    </p>

    <p>All Providers implemente the
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Interface', value: 'Vehicle'}}"
      >vehicle</nuxt-link>interface and some also the
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Interface', value: 'Station'}}"
      >station</nuxt-link>interface.
    </p>

    <p>Let's see how to use it.</p>

    <simple-vehicles class="mt-4 mb-4"/>

    <vehicles-and-stations class="mt-4 mb-4"/>

    <omit-vehicles class="mt-4 mb-4"/>

    <single-vehicles class="mt-4 mb-4"/>

    <p>Continue with
      <nuxt-link to="/docs/accounts">Accounts</nuxt-link>.
    </p>
  </div>
</template>

<script>
import SimpleVehicles from '~/components/docs/playground/simpleVehicles.vue'
import VehiclesAndStations from '~/components/docs/playground/vehiclesAndStations.vue'
import OmitVehicles from '~/components/docs/playground/omitVehicles.vue'
import singleVehicles from '~/components/docs/playground/singleVehicles.vue'
export default {
  components: { SimpleVehicles, VehiclesAndStations, OmitVehicles, singleVehicles },
  head() {
    return {
      title: 'Documentation - Objects - Multicycles API',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Query available bikes, stations and other vehicles with the API.'
        }
      ]
    }
  }
}
</script>
