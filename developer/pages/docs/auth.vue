<template>
  <div>
    <h3>Authentication</h3>

    <h4 class="mt-4 mb-4">Access Tokens</h4>

    <p>To use Multicycles APIs, you'll need an access token. Multicycles API uses access tokens to associate requests to API resources with your account. You can find all your access tokens, create new ones, or delete existing ones on your account page.</p>

    <h4 class="mt-4 mb-4">Scopes</h4>
    <p>
      Access tokens can have differents scopes. Each APIs require a specific scope. A scope can be for public or private access token.
      <br>An access tokens with private scopes are very sensitive. They can retreive private data and or create, update or delete datas.
      Access tokens with private scopes should never be accessible by your users. They must not be included into front or mobile applications.
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
