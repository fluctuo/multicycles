<template>
  <div>
    <div class="titi">
      <b-container>
        <h1 class="display-3">Pricing</h1>
        <h2>Start using Multicycles API for free.
          <br>Price per use are available for commercials projects and heavy applications.
        </h2>
      </b-container>
    </div>

    <pricing-plans class="mt-5"/>

    <pricing-services/>

    <contact/>
  </div>
</template>

<script>
import PricingPlans from '~/components/pricing/Plans.vue'
import PricingServices from '~/components/pricing/Services.vue'
import Contact from '~/components/Contact.vue'

export default {
  components: { PricingPlans, PricingServices, Contact },
  head() {
    return {
      title: 'Pricings',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Multicycles API come with two differents pricing plans. Start using this API for free. Price per use are available for commercials projects and heavy applications.'
        }
      ]
    }
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
