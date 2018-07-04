<template>
  <div>
    <h3>Introduction</h3>

    <p>
      Open-API by Multicycles is a GraphQL API.<br>
      The docs in the sidedar are generated from the endpoint. Use these docs to find out what data you can call.
    </p>

    <p>
      All GraphQL should use the endpoint <code>https://api.Multicycles.org/v1</code>. Requests should be authenticated, see <nuxt-link to="/docs/auth">authentication</nuxt-link>
    </p>

    <h4>Basic Exemple</h4>

    <graphql-playground :query="query" :variables="variables" :response="response"/>
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
    variables: JSON.stringify({
      lat: 48.829698,
      lng: 2.387919
    }, null, 2),
    response: JSON.stringify({
      data: {
        vehicles: [{
          "id": "0lye9Z",
          "type": "BIKE",
          "attributes": [
            "GEARS"
          ],
          "lat": 48.829906421796,
          "lng": 2.3879092641104,
          "carno": "0lye9Z",
          "provider": {
            "name": "Ofo"
          }
        }
      ]}
    }, null, 2)
  })
}
</script>
