<template>
  <div>
    <h4>Get vehicles with omitted providers</h4>

    <p>
      In order to optimize calls, it may be interesting to restrict the suppliers requested.<br>
      You can add a list of suppliers to be omitted as arguments.
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response" />
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `query ($lat: Float!, $lng: Float!, $excludeProviders: [String]) {
  vehicles(lat: $lat, lng: $lng, excludeProviders: $excludeProviders) {
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
        lng: 2.387919,
        excludeProviders: ['mobike']
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
