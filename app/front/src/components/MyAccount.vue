<template>
  <div class="providers">
    My accounts:
    {{ myAccount.subAccounts.length }}
    <my-sub-account provider="voi" />
    <!-- <my-sub-account provider="lime" /> -->
    <!-- <my-sub-account provider="bird" /> -->
    <my-sub-account provider="tier" />
    <!-- <my-sub-account provider="hive" />
    <my-sub-account provider="circ" />
    <my-sub-account provider="ufo" />
    <my-sub-account provider="moow" /> -->

    <div v-if="getStripeInformation">
      <h2>My payment methods:</h2>

      <div v-for="paymentMethod in myAccount.paymentMethods" v-bind:key="paymentMethod.id">
        {{ paymentMethod.type }}
        {{ paymentMethod.card.last4 }}
        {{ paymentMethod.card.expMonth }}/{{ paymentMethod.card.expYear }}

        <button @click="removePaymentMethod(paymentMethod.id)">Delete</button>
        <button v-if="!paymentMethod.isDefault" @click="setDefaultPaymentMethod(paymentMethod.id)">
          Set as default
        </button>
      </div>

      <h2>Add methods:</h2>
      <StripeElements
        :stripe-key="getStripeInformation.stripePublishableKey"
        :instance-options="instanceOptions"
        :elements-options="elementsOptions"
        #default="{ elements }"
        ref="elms"
      >
        <StripeElement type="card" :elements="elements" :options="cardOptions" ref="card" />
      </StripeElements>

      <div>Add payment method</div>
      <button @click="addCard1()">Workflow 1 (setup then set PM)</button>
      &nbsp;
      <button @click="addCard2()">Workflow 2 (setup with PM)</button>
    </div>

    <div :v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <h2>Past Trips:</h2>

    <table>
      <tr>
        <th>Date</th>
        <th>Provider</th>
        <th>Vehicle</th>
        <th>Distance</th>
        <th>Duration</th>
        <th>Cost</th>
        <th>Paid?</th>
      </tr>
      <tr v-for="trip in completedTrips" v-bind:key="trip.id">
        <td>{{ displayDate(trip.startedAt) }}</td>
        <td>{{ trip.provider.name }}</td>
        <td>{{ trip.vehicleFriendlyId }}</td>
        <td>{{ trip.distance }}</td>
        <td>{{ trip.duration }}</td>
        <td>{{ trip.cost / 100 }}</td>
        <td>
          {{ trip.paymentStatus }}
          <button v-if="trip.paymentStatus === 'NEED_PAYMENT'" @click="payTrip(trip.id)">Pay</button>
        </td>
      </tr>
    </table>

    <h2>Stripe Payment (Sandbox ONLY):</h2>

    <button v-if="!getStripeInformation" @click="setStripeStatus(true)">Enable</button>
    <button v-else @click="setStripeStatus(false)">Disable</button>
    (Apply to all users)
  </div>
</template>

<script>
import { mapState } from 'vuex'
import gql from 'graphql-tag'

import { StripeElements, StripeElement } from 'vue-stripe-elements-plus'

import MySubAccount from './MySubAccount'

export default {
  name: 'MyAccount',
  components: {
    MySubAccount,
    StripeElements,
    StripeElement
  },
  data() {
    return {
      getStripeInformation: null,
      elementsOptions: {},
      cardOptions: {},
      errorMessage: null,
      errorTimeout: null
    }
  },
  computed: {
    ...mapState(['myAccount', 'completedTrips']),
    instanceOptions() {
      return {
        stripeAccount: this.getStripeInformation?.stripeAccountId
      }
    },
    stripe() {
      const groupComponent = this.$refs.elms

      return groupComponent.instance
    }
  },
  methods: {
    async addCard1() {
      this.errorMessage = null
      try {
        const setupIntent = await this.addPaymentMethod()

        const paymentMethod = await this.createPaymentMethod()

        await this.confirmCard(setupIntent, paymentMethod.id)
      } catch (error) {
        this.displayError(error)
      }
    },
    async addCard2() {
      this.errorMessage = null
      try {
        const paymentMethod = await this.createPaymentMethod()

        const setupIntent = await this.addPaymentMethod(paymentMethod.id)

        if (setupIntent && setupIntent.status === 'requires_action') {
          await this.confirmCard(setupIntent)
        }
      } catch (error) {
        this.displayError(error)
      }
    },
    async createPaymentMethod() {
      const cardComponent = this.$refs.card

      const cardElement = cardComponent.stripeElement

      const stripe = this.stripe

      const res = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      })

      if (res.error) {
        throw res.error
      }

      return res.paymentMethod
    },
    async addPaymentMethod(paymentMethodId) {
      try {
        const res = await this.$apolloProvider.defaultClient.mutate({
          mutation: gql`
            mutation($accountId: String!, $paymentMethodId: String) {
              addPaymentMethod(accountId: $accountId, paymentMethodId: $paymentMethodId)
            }
          `,
          variables: {
            accountId: this.myAccount.id,
            paymentMethodId
          }
        })

        this.$store.dispatch('getMyAccount')

        return res.data.addPaymentMethod
      } catch (error) {
        this.displayError(error)
      }
    },
    async confirmCard(intent, paymentMethod) {
      const { error } = await this.stripe.confirmCardSetup(intent.clientSecret, {
        payment_method: paymentMethod
      })

      this.$store.dispatch('getMyAccount')

      if (error) {
        throw error
      }
    },
    async removePaymentMethod(paymentMethodId) {
      this.errorMessage = null
      try {
        const res = await this.$apolloProvider.defaultClient.mutate({
          mutation: gql`
            mutation($accountId: String!, $paymentMethodId: String!) {
              removePaymentMethod(accountId: $accountId, paymentMethodId: $paymentMethodId)
            }
          `,
          variables: {
            accountId: this.myAccount.id,
            paymentMethodId
          }
        })

        this.$store.dispatch('getMyAccount')

        if (res.errors) {
          throw new Error(res.errors[0].message)
        }
      } catch (error) {
        this.displayError(error)
      }
    },
    async setDefaultPaymentMethod(paymentMethodId) {
      this.errorMessage = null
      try {
        const res = await this.$apolloProvider.defaultClient.mutate({
          mutation: gql`
            mutation($accountId: String!, $paymentMethodId: String!) {
              setDefaultPaymentMethod(accountId: $accountId, paymentMethodId: $paymentMethodId)
            }
          `,
          variables: {
            accountId: this.myAccount.id,
            paymentMethodId
          }
        })

        this.$store.dispatch('getMyAccount')

        if (res.errors) {
          throw new Error(res.errors[0].message)
        }
      } catch (error) {
        this.displayError(error)
      }
    },
    async setStripeStatus(enabled) {
      return this.$apolloProvider.defaultClient
        .mutate({
          mutation: gql`
            mutation($enabled: Boolean!) {
              setStripeStatus(enabled: $enabled)
            }
          `,
          variables: {
            enabled
          }
        })
        .then(this.$apollo.queries.getStripeInformation.refetch())
    },
    async payTrip(tripId) {
      try {
        const res = await this.$apolloProvider.defaultClient.mutate({
          mutation: gql`
            mutation($tripId: String!, $accountId: String!) {
              payMyTrip(tripId: $tripId, accountId: $accountId)
            }
          `,
          variables: {
            accountId: this.myAccount.id,
            tripId
          }
        })

        const { paymentIntent, message } = res.data?.payMyTrip
        if (message && message.type === 'error') {
          throw new Error(message.text)
        }

        if (paymentIntent && paymentIntent.status === 'requires_action') {
          await this.stripe.confirmCardPayment(paymentIntent.clientSecret)
        }

        this.$store.dispatch('getCompletedTrips')

        if (res.errors) {
          throw new Error(res.errors[0].message)
        }
      } catch (error) {
        this.displayError(error)
      }
    },
    async displayError(error) {
      console.error(error)

      if (this.errorTimeout) {
        clearTimeout(this.errorTimeout)
      }

      this.errorMessage = error.message || error

      this.errorTimeout = setTimeout(() => {
        this.errorMessage = null
      }, 4000)
    },
    displayDate(timestamp) {
      return new Date(timestamp * 1000).toLocaleString()
    }
  },
  apollo: {
    getStripeInformation: {
      query: gql`
        query getStripeInformation {
          getStripeInformation
        }
      `
    }
  }
}
</script>

<style lang="scss" scoped>
.providers > div + div {
  border-top: 1px solid #fff;
}

.error-message {
  color: #f00;
}
</style>
