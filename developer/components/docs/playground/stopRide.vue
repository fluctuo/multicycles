<template>
  <div>
    <h4>Stop Ride</h4>

    <p>Call the "
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Mutation', value: 'stopRide'}}"
      >stopRide</nuxt-link>" mutation to stop trip and lockl vehicle.
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response"/>
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `mutation stopRide($accountId: String!, $rideId: String!, $lat: Float!, $lng: Float!) {
  stopRide(accountId: $accountId, rideId: $rideId, lat: $lat, lng: $lng) {
    id
  }
}
`,
    variables: JSON.stringify(
      {
        accountId: 'YWNjb3VudDo3MjAxYTA3ZC1lYmE3LTQ1N2QtYWIyMi1hY2I2NzQ2YTg1ZjE=',
        rideId: 'cmlkZTo1YzdlYWZhMi0xOGYwLTQzMDUtOTBkYy01OWU4ZWUyMWYwMmE=',
        lat: 48.829698,
        lng: 2.387919
      },
      null,
      2
    ),
    response: JSON.stringify(
      {
        data: {
          stopRide: {
            id: 'cmlkZTo1YzdlYWZhMi0xOGYwLTQzMDUtOTBkYy01OWU4ZWUyMWYwMmE='
          }
        }
      },
      null,
      2
    )
  })
}
</script>
