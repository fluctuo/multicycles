<template>
  <div>
    <h4>Get providers available at this location</h4>

    <p>
      To obtain this data, the "<nuxt-link :to="{name: 'api-type-value', params: {type: 'Query', value: 'providers'}}">providers</nuxt-link>" query is appropriate.<br>
      It takes in argument a position (latitude, longitude) and returns an array of providers
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
  providers (lat: $lat, lng: $lng) {
    name
    slug
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
          providers: [
            {
              name: 'Ofo',
              slug: 'ofo'
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
