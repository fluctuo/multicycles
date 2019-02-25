<template>
  <div>
    <b-container class="mt-5">
      <b-row align="center">
        <b-col>
          <h2>Be partner of the Multicycles revolution</h2>
          <p>The world is in perpetual motion, become a member of the Multicycles revolution.
            <br>Spread your service effectively, address yourself to the whole world.
          </p>
        </b-col>
      </b-row>
    </b-container>

    <b-container class="mt-5">
      <b-row align-v="center" align="center">
        <b-col sm="6">
          <h3>Increase your audience size</h3>
          <p>Residents or tourists, reach a larger audience. The dozen applications using the Multicycles API allow you to introduce your service to thousands of users.</p>
        </b-col>
        <b-col sm="6">
          <b-img fluid src="~assets/partners2.png" alt="Aggregation app"/>
        </b-col>
      </b-row>
    </b-container>

    <b-container class="mt-5">
      <b-row align-v="center" align="center">
        <b-col sm="6" order="2" order-sm="1">
          <b-img fluid src="~assets/partners.png" alt="Aggregation app"/>
        </b-col>
        <b-col sm="6" order="1" order-sm="2">
          <h3>The commuting reflex</h3>
          <p>Keep your users loyal by allowing them to use their favorite navigation application. It is the quality and comfort of your vehicles that they appreciate.</p>
        </b-col>
      </b-row>
    </b-container>

    <contact-partner/>
  </div>
</template>

<script>
import ContactPartner from '~/components/ContactPartner.vue'

export default {
  components: { ContactPartner },
  head() {
    return {
      title: 'Be partner of the Multicycles revolution',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Be partner of the Multicycles revolution. Increase your audience size. Residents or tourists, reach a larger audience. The dozen applications using the Multicycles API allow you to introduce your service to thousands of users. The commuting reflex. Keep your users loyal by allowing them to use their favorite navigation application. It is the quality and comfort of your vehicles that they appreciate.'
        }
      ]
    }
  }
}
</script>
