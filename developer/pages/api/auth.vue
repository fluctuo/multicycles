<template>
  <div>
    <h3>Authentication</h3>

    <p>To use Multicycles API, you'll need an access token. We use this access token to associate GraphQL request to your account.
      <br>You can find your access tokens, create new or delete existing ones on your
      <nuxt-link to="/account">account</nuxt-link>
    </p>

    <h4>Use access tokens</h4>

    <p>
      To authorize GraphQL request, you must set
      <code>access_token</code> query string with one of yours.
    </p>

    <pre v-highlightjs><code class="bash">
      curl --request POST \
        --url https://api.multicycles.org/v1?access_token=MY_ACCESS_TOKEN \
        --header 'content-type: application/json' \
        --data '{"query":"query ($lat: Float!, $lng: Float!) {\n  vehicles(lat: $lat, lng: $lng) {\n\t\tid\n  }\n}","variables":{"lat":48.856614,"lng":2.352222}}'
    </code></pre>
  </div>
</template>
