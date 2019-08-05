<template>
  <div>
    <b-card>
      <b-row align-v="center">
        <b-col>
          <b>Free</b>

          <p>For demo and small projects.</p>

          <ul class="list-unstyled mt-3 mb-4">
            <li>All providers</li>
            <li>Fair-use requests & rate limited</li>
            <li>Basic support</li>
          </ul>
        </b-col>
        <b-col cols="4" class="text-center">
          <b-btn
            :disabled="isCurrentPlan(1)"
            variant="primary"
            @click="updateToPlan(1)"
          >{{ isCurrentPlan(1) ? 'Current' : 'Change' }}</b-btn>
        </b-col>
      </b-row>
    </b-card>
    <b-card class="mt-3">
      <b-row align-v="center">
        <b-col>
          <b>Enterprise</b>

          <p>Business application or High volume APIs</p>

          <ul class="list-unstyled mt-3 mb-4">
            <li>All providers</li>
            <li>No limits</li>
            <li>Premium support</li>
          </ul>
        </b-col>
        <b-col cols="4" class="text-center">
          <b>Pay per usage</b>
          <br />See
          <nuxt-link to="/pricing">pricings</nuxt-link>
          <br />
          <b-btn
            :disabled="isCurrentPlan(2)"
            variant="primary"
            @click="updateToPlan(2)"
          >{{ isCurrentPlan(2) ? 'Current' : 'Change' }}</b-btn>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    currentPlan: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(['updateSubscription']),
    isCurrentPlan(planId) {
      return this.currentPlan && this.currentPlan.id === planId
    },
    updateToPlan(planId) {
      if (planId === 2) {
        this.$bvModal.show('editUser')

        this.$root.$on('fluctuo::editUser::updated', (bvEvent, modalId) => {
          this.$bvModal.hide('editUser')
          if (!this.$store.state.auth.user.payementInformation) {
            this.$root.$emit('openCreditCardModal')

            this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
              if (modalId === 'creditCard') {
                if (this.$store.state.auth.user.payementInformation) {
                  this.updateSubscription(planId).then(() => {
                    this.$root.$emit('bv::hide::modal', 'planSelector')
                  })
                }
              }
            })
          } else {
            this.updateSubscription(planId).then(() => {
              this.$root.$emit('bv::hide::modal', 'planSelector')
            })
          }
        })
      } else {
        this.updateSubscription(planId).then(() => {
          this.$root.$emit('bv::hide::modal', 'planSelector')
        })
      }
    }
  }
}
</script>
