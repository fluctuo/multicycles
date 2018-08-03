<template>
  <div>
    <h3>Recipes</h3>

    <h4>Get vehicles</h4>

    <p>The most simpe query. All fields are optionnal.</p>

    <graphql-playground :query="vehicles.query" :variables="vehicles.variables" :response="vehicles.response"/>

    <h4 class="mt-5">Get vehicles with stations</h4>

    <p>
      Some providers has only stations (dock system) or are hybrid. Stations are mixed on <nuxt-link :to="{ name: 'docs-type-value', params: { type: 'Query', value: 'vehicles' }}">Vehicles Query</nuxt-link>. Provider with stations ll implement both interface, <nuxt-link :to="{ name: 'docs-type-value', params: { type: 'Types', value: 'Vehicle' }}">Vehicle</nuxt-link> and <nuxt-link :to="{ name: 'docs-type-value', params: { type: 'Types', value: 'Station' }}">Station</nuxt-link> (eg <nuxt-link :to="{ name: 'docs-type-value', params: { type: 'Types', value: 'Nextbike' }}">Nextbike</nuxt-link>). <br>
      You can have station detail with <a href="https://graphql.org/learn/queries/#inline-fragments">GraphQL Inline fragment</a>.
    </p>

    <graphql-playground :query="stations.query" :variables="stations.variables" :response="stations.response"/>
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    vehicles: {
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
    },
    stations: {
      query: `query ($lat: Float!, $lng: Float!) {
  vehicles (lat: $lat, lng: $lng) {
    id
    type
    lat
    lng
    provider {
      name
    }
    ... on Station {
			total_stands
			availableStands
      availableVehicles
      isVirtual
		}
  }
}`,
      variables: JSON.stringify({
	      lat: 52.520007,
	      lng: 13.404954
      }, null, 2),
      response: JSON.stringify({
        data: {
          vehicles: [{
            "id": "3165048",
            "type": "STATION",
            "lat": 52.52232494,
            "lng": 13.4010843,
            "provider": {
              "name": "Nextbike"
            },
            "total_stands": 15,
            "availableStands": 6,
            "availableVehicles": 5,
            "isVirtual": false
          },
          {
            "id": "8509239",
            "type": "BIKE",
            "lat": 52.5227692,
            "lng": 13.4031083,
            "provider": {
              "name": "Nextbike"
            },
            "total_stands": null,
            "availableStands": null,
            "availableVehicles": null
          },
          {
            "id": "A810004051",
            "type": "BIKE",
            "lat": 52.520222,
            "lng": 13.407263,
            "provider": {
              "name": "Mobike"
            }
          }
        ]}
      }, null, 2)
    }
  })
}
</script>
