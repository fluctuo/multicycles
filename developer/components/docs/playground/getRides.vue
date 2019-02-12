<template>
  <div>
    <h4>Get rides</h4>

    <p>Rides are returned in aggregate and paginated form. It is possible to filter by status. See
      <nuxt-link :to="{name: 'api-type-value', params: {type: 'Query', value: 'getRides'}}">getRides</nuxt-link>.
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response"/>
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `query getRides($accountId: String!) {
  getRides(accountId: $accountId, status: ["riding", "completed"]) {
    total
    limit
    nodes {
      id
      status
      distance
      cost
      startedAt
      provider {
        name
      }
    }
  }
}
`,
    variables: JSON.stringify(
      {
        accountId: 'YWNjb3VudDpjZDJjYzMzNi1iZGU1LTQ2MmUtYmNkNS01NmRlOWRjNzZmN2Y='
      },
      null,
      2
    ),
    response: JSON.stringify(
      {
        data: {
          getRides: {
            total: 2,
            limit: 50,
            nodes: [
              {
                id: 'cmlkZTphODkzZWIzYS0zNjkxLTRlZjQtODllMS0zNWU5MjlmYzQ4NTk=',
                status: 'completed',
                distance: 0,
                cost: 100,
                startedAt: '1546360249',
                provider: {
                  name: 'Bird'
                }
              },
              {
                id: 'cmlkZTo3NTZjZDdjMi04ZTNjLTQ4NTctYTU1Ny1lNDI2MzMyZTExNDM=',
                status: 'completed',
                distance: 247,
                cost: 130,
                startedAt: '1546354151',
                provider: {
                  name: 'Bird'
                }
              }
            ]
          }
        }
      },
      null,
      2
    )
  })
}
</script>
