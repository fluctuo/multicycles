<template>
  <div>
    <h4>Obtain objects from a single provider</h4>

    <p>
      Sometimes we want to retrieve data from only one or two providers. It may be easier to call supplier requests directly than to omit all requests except the ones you want.
    </p>

    <p>
      Each providers call be called as a query.<br>
      Instead of using <nuxt-link :to="{name: 'api-type-value', params: {type: 'Query', value: 'vehicles'}}">vehicles</nuxt-link> query, use the needed provider query like <nuxt-link :to="{name: 'api-type-value', params: {type: 'Query', value: 'ofo'}}">ofo</nuxt-link>.
      In this case, it is simply necessary to make a GraphQL request with always the location in arguments.
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
  ofo (lat: $lat, lng: $lng) {
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
          ofo: [
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
