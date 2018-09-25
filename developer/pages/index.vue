<template>
  <div>
    <div class="titi">
      <b-container>
        <h1 class="display-3">The Open API <br> for Bikes sharing</h1>
        <h2>
          The only API for dockless bicycles and other shared vehicles.<br> Explore and get instant vehicle positions in a single query.
        </h2>

        <div class="mt-5">
          <b-button size="lg" variant="primary" href="/account">Start exploring</b-button>
          <b-button variant="outline-light" class="ml-2" href="mailto:contact@multicycles.org">Contact us</b-button>
        </div>
      </b-container>
    </div>

    <features/>

    <contact />

  </div>
</template>

<script>
import features from '~/components/Features.vue'
import Contact from '~/components/Contact.vue'

export default {
  components: { features, Contact }
}
</script>

<style lang="scss">
@import '~/scss/app.scss';

.titi {
  background-image: url('~assets/home-background-bike.jpg');
  background-size: cover;
  background-position: center;

  color: $light;

  padding: 120px 0;
}
</style>
