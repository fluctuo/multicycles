<template>
  <div>
    <h4>List accounts</h4>

    <p>
      The list of accounts is returned as a paginated collection.
      <br>The returned accounts contain the related vendor subaccounts.
      To list the accounts, simply call the request "
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Query', value: 'getAccounts'}}"
      >getAccounts</nuxt-link>".
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response"/>
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `query {
  getAccounts(page: 1, limit: 10) {
    total
    page
    nodes {
      id
      name
      subAccounts {
        provider {
          name
        }
      }
    }
  }
}`,
    variables: '{}',
    response: JSON.stringify(
      {
        data: {
          getAccounts: {
            total: 1,
            limit: 50,
            page: 1,
            nodes: [
              {
                id: 'YWNjb3VudDplNjcyZjgwMy01NzQyLTQ4NzgtOThkZS0wZTNjNjg1MzQ1NzM=',
                name: 'Joe Doe',
                subAccounts: [
                  {
                    provider: {
                      name: 'Bird'
                    }
                  },
                  {
                    provider: {
                      name: 'Lime'
                    }
                  }
                ]
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
