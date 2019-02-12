<template>
  <div>
    <h3>API Introduction</h3>

    <p>
      <nuxt-link to="/">Multicycles API</nuxt-link>is a
      <a href="https://graphql.org/">GraphQL</a> API.
      <br>The docs in the sidedar are generated from the endpoint. Use these docs to find out what data you can get.
    </p>
    <p>All GraphQL requests should use the endpoint https://api.multicycles.org/v1. Requests should be authenticated, see
      <nuxt-link to="/docs/auth">authentication</nuxt-link>.
    </p>

    <h4>What is GraphQL?</h4>

    <p>
      <a href="https://graphql.org/">GraphQL</a> is a powerful query language for API.
    </p>

    <ul>
      <li>It allow you to query exactly what you need, nothing more and nothing less. GraphQL queries always return predictable results. Apps using GraphQL are fast and stable because they control the data they get, not the server.</li>
      <li>Get many resources in a single request</li>
      <li>Strongly typed. The schema defines an API's type system and all object relationships.</li>
      <li>Introspective. A client can query the schema for details about the schema.</li>
    </ul>

    <h4>Why we using GraphQL?</h4>

    <p>
      As we saw earlier,
      <a href="https://graphql.org/">GraphQL</a> offers many advantages to users such as introspection, the ability to precisely define the data you want and the type system.
    </p>
  </div>
</template>
