<template>
  <b-container id="features">
    <h3 class="display-4 text-center pt-5 pb-4">Features</h3>

    <b-row align-v="center">
      <b-col class="text-center">
        <b-img src="~/assets/aggreation-feature.jpg" height="250" alt="transparent" class="m-1" />
      </b-col>
      <b-col class="text-center">
        <h4>Many providers, worldwide</h4>
        <p>
          Implements many bike sharing suppliers like Mobike or Ofo and other shared vehicles (scooters, cars). <span class="font-weight-bold">More than 20 providers</span> are already implemented and we regularly add some. <br>
          Available wordwide, no coutries locks.
        </p>
      </b-col>
    </b-row>

    <b-row align-v="center" class="mt-5">
      <b-col class="text-center">
        <h4>Standardized</h4>
        <p>
          Return <span class="font-weight-bold">standardized data</span> (like type, attributes, mobile app link) and providers specific fields. Backward compatibilty guarantee.
        </p>
      </b-col>
      <b-col class="text-center">
        <b-img src="~/assets/standard-feature.jpg" height="400" alt="transparent" class="m-1" />
      </b-col>
    </b-row>

    <b-row align-v="center" class="mt-5">
      <b-col class="text-center">
        <b-img src="~/assets/GraphQL_Logox175.png" alt="transparent" class="m-1" />
      </b-col>
      <b-col class="text-center">
        <h4>Easy to implement</h4>
        <p>
          Open-API use latest technologies. Our api offer a <span class="font-weight-bold">GraphQL endpoint</span>. You can exactly what you want in a single query.<br>
          See <nuxt-link to="docs">documentation</nuxt-link>. You can't do easier.
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>
