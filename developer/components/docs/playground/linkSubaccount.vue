<template>
  <div>
    <h4>link subaccount</h4>

    <p>For linking a subaccount to an account, just call the mutation
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Mutation', value: 'linkSubAccount'}}"
      >linkSubAccount</nuxt-link>&nbsp;with the two parameters.
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response"/>
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `mutation linkSubAccount($accountId: String!, $puid: String!) {
  linkSubAccount(accountId: $accountId, puid: $puid) {
    id
  }
}`,
    variables: JSON.stringify(
      {
        accountId: 'YWNjb3VudDpjZDJjYzMzNi1iZGU1LTQ2MmUtYmNkNS01NmRlOWRjNzZmN2Y=',
        puid: 'cHVpZDo0NWJmZWUwNy0wZWU1LTQ1YTMtOTk1MC03Mzk2YmM5NTBlYTM='
      },
      null,
      2
    ),
    response: JSON.stringify(
      {
        data: {
          linkSubAccount: {
            id: 'YWNjb3VudDpjZDJjYzMzNi1iZGU1LTQ2MmUtYmNkNS01NmRlOWRjNzZmN2Y='
          }
        }
      },
      null,
      2
    )
  })
}
</script>
