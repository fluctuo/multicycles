<template>
  <div>
    <h4>Create account</h4>

    <p>You must use the "
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Mutation', value: 'createAccount'}}"
      >createAccount</nuxt-link>" mutation to create a new account. It is possible to pass a name and an email in parameter to facilitate its identification later.
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response"/>
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `mutation createAccount {
  createAccount(name: "John Doe", email: "john@doe.com") {
    id
    name
    email
  }
}
`,
    variables: '{}',
    response: JSON.stringify(
      {
        data: {
          createAccount: {
            id: 'YWNjb3VudDpjMmY0MzQ0My1jZWY0LTQ5YzYtYjk1My1jNjYwZWM0NmUyNzA=',
            name: 'John Doe',
            email: 'john@doe.com'
          }
        }
      },
      null,
      2
    )
  })
}
</script>
