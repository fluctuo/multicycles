<template>
  <div>
    <h3>Authentication</h3>

    <p>
      All queries should be uuthenticated<br>
      Sign-in and get an API key on your account.
    </p>

    <p>
      Set the API key on <pre>Authorization</pre> header.
    </p>

    <pre v-highlightjs><code class="bash">
      curl --request POST \
        --url https://api.multicycles.org/v1 \
        --header 'content-type: application/json' \
        --header 'Authorization: Bearer ACCESS_TOKEN' \
        --data '{"query":"query ($lat: Float!, $lng: Float!) {\n  bikes(lat: $lat, lng: $lng) {\n\t\tid\n  }\n}","variables":{"lat":48.856614,"lng":2.352222}}'
    </code></pre>
  </div>
</template>

