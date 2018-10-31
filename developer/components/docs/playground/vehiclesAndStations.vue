<template>
  <div>
    <h4>Get vehicles & stations</h4>

    <p>
      In order to get stations details, we must use Inline Fragments GraphQL
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response" />

  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `query ($lat: Float!, $lng: Float!) {
  vehicles (lat: $lat, lng: $lng) {
    type
    ... on Station {
      availableVehicles
      availableStands
      isVirtual
    }
  }
}`,
    variables: JSON.stringify(
      {
        lat: 52.504,
        lng: 13.393
      },
      null,
      2
    ),
    response: JSON.stringify(
      {
        data: {
          vehicles: [
            {
              type: 'BIKE',
              availableVehicles: null,
              availableStands: null,
              isVirtual: null
            },
            {
              type: 'STATION',
              availableVehicles: 15,
              availableStands: 5,
              isVirtual: false
            }
          ]
        }
      },
      null,
      2
    )
  })
}
</script>
