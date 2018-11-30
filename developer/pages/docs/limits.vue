<template>
  <div>
    <h3>Units & Limits</h3>

    <h4 class="mt-4 mb-4">Units</h4>

    <p>This API use GraphQL instead of REST. With GraphQL, one GraphQL call can replace multiple REST calls. A single complex GraphQL call could be the equivalent of thousands of REST requests.
      <br>An HTTP request no longer exactly represents the true cost for the API. That's why we introduced an intermediate unit, "units".
    </p>

    <p>
      Each GraphQL queries costs a certain amount of unit (10 units for
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Interface', value: 'Vehicle'}}"
      >vehicle</nuxt-link>).
      You can find out the cost of each requests by consulting the documentation or by looking at the response header.
    </p>

    <b-card-group deck>
      <b-card img-src="~assets/cost-10.png" img-alt="Card image" img-top>
        <p class="card-text">This request will have a cost of 10 units.</p>
      </b-card>
      <b-card img-src="~assets/cost-20.png" img-alt="Card image" img-top>
        <p
          class="card-text"
        >On this request, we call two queries of 10 units. The total will be 20 units.</p>
      </b-card>
    </b-card-group>

    <h4 class="mt-4 mb-4">Limits</h4>

    <p>Paying plan are not limited.
      <br>Only the free plan have a rate-limit and a maximum count of units per month.
      <br>See
      <nuxt-link to="/pricing">pricing</nuxt-link>
    </p>
  </div>
</template>
