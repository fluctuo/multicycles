<template>
  <div v-if="subscription">
    <b>{{ subscription.plan.name | capitalize }}</b><br>
    {{ subscription.plan.support | capitalize }} support<br>

    <b-table :items="limits" thead-class="d-none" striped hover />

    <b-btn v-b-modal.planSelector variant="primary">Change plan</b-btn>
    <b-modal id="planSelector" ref="planSelectorModal" title="Choose plan" hide-footer>
      <plan-selector :current-plan="subscription.plan" />
    </b-modal>
  </div>
</template>

<script>
const limitToDescription = {
  tokens: 'Maximum tokens',
  hitsPerMin: 'Queries per minutes',
  hitsPerMonth: 'Maximum query per month'
}

import PlanSelector from './PlanSelector.vue'

export default {
  components: { PlanSelector },
  props: {
    subscription: {
      type: [Object, Boolean],
      required: true
    }
  },
  computed: {
    limits() {
      return Object.entries(this.subscription.limits).map(l => {
        const description = limitToDescription[l[0]]
        if (description) {
          return [description, l[1]]
        }

        return l
      })
    }
  },
  methods: {}
}
</script>
