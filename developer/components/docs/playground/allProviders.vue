<template>
  <div>
    <h4>Get all providers</h4>

    <p>
      Location argument is optional, it may be interesting to know all the suppliers implemented in the API.
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response" />
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `query {
  providers {
    name
    slug
  }
}`,
    variables: '{}',
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
