<template>
  <div>
    <h4>Get vehicles</h4>

    <p>
      The most simple query.<br>
      It takes as its argument a position (latitude, longitude) and returns an array of objects (<nuxt-link :to="{name: 'api-type-value', params: {type: 'Interface', value: 'Vehicle'}}">vehicle</nuxt-link> & <nuxt-link :to="{name: 'api-type-value', params: {type: 'Interface', value: 'Station'}}">station</nuxt-link>) available within a radius of 400 meters.
    </p>

    <p>
      The fields returned correspond to those requested. See <nuxt-link :to="{name: 'api-type-value', params: {type: 'Interface', value: 'Vehicle'}}">vehicles</nuxt-link> & <nuxt-link :to="{name: 'api-type-value', params: {type: 'Interface', value: 'Station'}}">stations</nuxt-link> Interfaces for available fields.
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
    id
    type
    attributes
    lat
    lng
    provider {
      name
    }
  }
}`,
    variables: JSON.stringify(
      {
        lat: 48.829698,
        lng: 2.387919
      },
      null,
      2
    ),
    response: JSON.stringify(
      {
        data: {
          vehicles: [
            {
              id: '0lye9Z',
              type: 'BIKE',
              attributes: ['GEARS'],
              lat: 48.829906421796,
              lng: 2.3879092641104,
              carno: '0lye9Z',
              provider: {
                name: 'Ofo'
              }
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
