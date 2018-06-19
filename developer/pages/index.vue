<template>
  <div>
    <div class="titi">
      <b-container>
        <h1 class="display-3">The Open API <br> for Bikes sharing</h1>
        <h2>
          The only API for dockless bicycles and other shared vehicles<br>
          Explore and get instant vehicle positions in a single query.
        </h2>

        <div class="mt-5">
          <b-button size="lg" variant="primary" href="/account">Start exploring</b-button>
          <b-button variant="outline-light" class="ml-2" href="mailto:contact@multicycles.org">Contact us</b-button>
        </div>
      </b-container>
    </div>

    <features/>

    <b-container class="mt-5">
      <hr>
    </b-container>

    <pricing/>

  </div>
</template>

<script>
import pricing from '~/components/Pricing.vue'
import features from '~/components/Features.vue'

export default {
  components: { pricing, features }
}
</script>

<style lang="scss">
@import '~/scss/app.scss';

.titi {
  background-image: url('~/assets/home-background-bike.jpg');
  background-size: cover;
  background-position: center;

  color: $light;

  padding: 120px 0;
}
</style>
