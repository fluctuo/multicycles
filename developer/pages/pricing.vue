<template>
  <div>
    <div class="titi">
      <b-container>
        <h1 class="display-3">Pricing</h1>
        <h2>
          Made with open-source software spirit, Open-API are free for non-profit OSS projets, with fair use and simple pricing for commercials projets
        </h2>
      </b-container>
    </div>

    <pricing-plans class="mt-5" />

    <pricing-services />

    <contact />

  </div>
</template>

<script>
import PricingPlans from '~/components/pricing/Plans.vue'
import PricingServices from '~/components/pricing/Services.vue'
import Contact from '~/components/Contact.vue'

export default {
  components: { PricingPlans, PricingServices, Contact },
  head: {
    title: 'Pricings - Open-API by Multicycles',
    meta: [
      {
        name: 'description',
        content:
          'Open-API come with differents pricing plans. Made with open-source software spirit, Open-API are free for non-profit OSS projets, with fair use and simple pricing for commercials projets'
      }
    ]
  }
}
</script>

<style lang="scss">
@import '~/scss/app.scss';

.titi {
  background-image: url('~assets/home-background-bike.jpg');
  background-size: cover;
  background-position: center;

  color: $light;

  padding: 50px 0;
}
</style>
