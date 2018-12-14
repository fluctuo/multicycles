<template>
  <div>
    <b-row>
      <b-col>
        <card :options="stripeOptions" :stripe="stripePublicKey" class="stripe-card" @change="complete = $event.complete" />
      </b-col>
    </b-row>

    <b-row align-h="end" align-v="center" class="d-flex pt-3">
      <b-col cols="auto">
        <b-button variant="link" @click="hide">Cancel</b-button>
      </b-col>
      <b-col cols="auto">
        <b-button :disabled="!complete" variant="success" @click="add">Save</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { Card, createToken } from 'vue-stripe-elements-plus'
import { mapActions } from 'vuex'

export default {
  name: 'CreditCardForm',
  components: { Card },
  data() {
    return {
      stripePublicKey: this.$env.STRIPE_PUBLIC_KEY,
      complete: false,
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      }
    }
  },
  methods: {
    ...mapActions(['addPayementInformation']),
    hide() {
      this.$root.$emit('bv::hide::modal', 'creditCard')
    },
    add() {
      createToken().then(data =>
        this.addPayementInformation(data.token.id).then(() => {
          this.$root.$emit('bv::hide::modal', 'creditCard')
        })
      )
    }
  }
}
</script>

<style lang="scss">
.stripe-card {
  display: block;
  width: 100%;
  padding: 6px 12px;
  padding: 0.375rem 0.75rem;
  font-size: 16px;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
