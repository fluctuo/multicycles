<template>
  <div>
    <h3>Rides</h3>

    <p>"Rides" refer to the trips made by the subaccount. By starting a ride, you unlock the specified vehicles.
      <br>Retrieving rides, start & stop rides requires a private scope. The use of these mutations must be reserved for backend.
    </p>

    <get-rides class="mt-4 mb-4"/>

    <start-ride class="mt-4 mb-4"/>

    <stop-ride class="mt-4 mb-4"/>

    <p>Continue with
      <nuxt-link to="/api">API references</nuxt-link>&nbsp;or
      <nuxt-link to="/account">get your free access token</nuxt-link>
    </p>
  </div>
</template>

<script>
import getRides from '~/components/docs/playground/getRides'
import startRide from '~/components/docs/playground/startRide'
import stopRide from '~/components/docs/playground/stopRide'

export default {
  components: {
    getRides,
    startRide,
    stopRide
  },
  head() {
    return {
      title: 'Documentation - Rides - Multicycles API',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Get users rides with the API.'
        }
      ]
    }
  }
}
</script>
