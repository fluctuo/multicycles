<template>
  <div id="graphiql">
    <GraphiQL :fetcher="graphQLFetcher" :query="query" :variables="variables" :response="response" />
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: String,
      required: true
    },
    variables: {
      type: String,
      required: true
    },
    response: {
      type: String,
      required: true
    }
  },
  methods: {
    graphQLFetcher(graphQLParams) {
      return this.$axios
        .post(`${process.env.MULTICYCLES_API}?access_token=${process.env.MULTICYCLES_ACCESS_TOKEN}`, graphQLParams)
        .then(response => response.data)
    }
  }
}
</script>


<style lang="scss">
@import 'graphiql/graphiql.css';

#graphiql {
  height: 500px;

  & > div {
    height: 100%;
  }
}

.graphiql-container {
  .topBar {
    .title,
    .toolbar {
      display: none;
    }
  }
  .docExplorerShow {
    display: none;
  }
}
</style>
