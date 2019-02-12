<template>
  <div>
    <h4>Start Ride</h4>

    <p>To start a trip it is necessary to pass the QRCODE ID or the plate number visible on the vehicle and the user's location.
      <br>After called the mutation
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Mutation', value: 'startRide'}}"
      >startRide</nuxt-link>, the vehicle should be unlocked (it could take some seconds).
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response"/>
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `mutation startRide($accountId: String!, $provider: String!, $token: String!, $lat: Float!, $lng: Float!) {
  startRide(accountId: $accountId, provider: $provider, token: $token, lat: $lat, lng: $lng) {
    id
    startedAt
    provider {
      name
      slug
    }
  }
}
`,
    variables: JSON.stringify(
      {
        accountId: 'YWNjb3VudDo3MjAxYTA3ZC1lYmE3LTQ1N2QtYWIyMi1hY2I2NzQ2YTg1ZjE=',
        provider: 'lime',
        token: 'T63SA5A=',
        lat: 48.829698,
        lng: 2.387919
      },
      null,
      2
    ),
    response: JSON.stringify(
      {
        data: {
          startRide: {
            id: 'cmlkZTo1YzdlYWZhMi0xOGYwLTQzMDUtOTBkYy01OWU4ZWUyMWYwMmE=',
            startedAt: '1548772491',
            provider: {
              name: 'Lime',
              slug: 'lime'
            }
          }
        }
      },
      null,
      2
    )
  })
}
</script>
