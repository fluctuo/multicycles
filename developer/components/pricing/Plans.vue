<template>
  <b-container>
    <b-row>
      <b-col>
        <h3 class="mb-3">Simple pricings</h3>
      </b-col>
    </b-row>
    <b-card-group deck class="mb-3 text-center">
      <b-card header="Free" header-class="display-5" header-bg-variant="primary" header-text-variant="white">
        <h1 class="card-title pricing-card-title">$0 <small class="text-muted">/ mo</small></h1>
        <p>For non-profit projects</p>
        <ul class="list-unstyled mt-3 mb-4">
          <li>All providers</li>
          <li>Fair-use requests</li>
          <li>Basic support</li>
          <li>Require attribution badge</li>
        </ul>

        <b-button slot="footer" size="lg" variant="primary" :to="{name: 'login'}">Sign up</b-button>
      </b-card>
      <b-card header="Commercial" header-class="display-5" header-bg-variant="primary" header-text-variant="white">
        <h1 class="card-title pricing-card-title">Contact us</h1>
        <p>For commercials projects.</p>
        <ul class="list-unstyled mt-3 mb-4">
          <li>All providers</li>
          <li>50,000 requests / months</li>
          <li>Premium support</li>
        </ul>

        <b-button slot="footer" size="lg" variant="outline-primary" href="mailto:contact@multicycles.org">Contact us</b-button>
      </b-card>
    </b-card-group>
  </b-container>
</template>
