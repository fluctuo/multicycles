<template>
  <b-container>
    <b-row>
      <b-col>
        <h3 class="mb-3">Simple pricings</h3>
      </b-col>
    </b-row>
    <b-card-group deck class="mb-3 text-center">
      <b-card
        header="Free"
        header-class="h1"
        header-bg-variant="primary"
        header-text-variant="white"
      >
        <h1 class="card-title pricing-card-title">0 €
          <br>
          <small class="text-muted">forever</small>
        </h1>
        <p>Perfect for hobbies, low traffic and demo applications.</p>
        <ul class="list-unstyled mt-3 mb-4">
          <li>All providers</li>
          <li>Fair-use requests</li>
          <li>Basic support</li>
        </ul>

        <b-button slot="footer" :to="{name: 'login'}" size="lg" variant="success">Explore</b-button>
      </b-card>
      <b-card
        header="For work"
        header-class="h1"
        header-bg-variant="primary"
        header-text-variant="white"
      >
        <h1 class="card-title pricing-card-title">0.80 €
          <br>
          <small class="text-muted">per 10.000 units</small>
        </h1>
        <p>For commercials projects or heavy applications.</p>
        <ul class="list-unstyled mt-3 mb-4">
          <li>All providers</li>
          <li>No limitations</li>
          <li>Premium support</li>
        </ul>

        <b-button slot="footer" :to="{name: 'login'}" size="lg" variant="success">Sign up</b-button>
      </b-card>
    </b-card-group>
    <b-alert variant="light" show>For units descriptions, see
      <nuxt-link to="/docs/limits">Units & Limits</nuxt-link>&nbsp;documentation.
    </b-alert>
  </b-container>
</template>
