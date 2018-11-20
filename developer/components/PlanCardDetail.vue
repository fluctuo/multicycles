<template>
  <div v-if="plan">
    <b>{{ plan.name | capitalize }}</b><br>
    {{ plan.support | capitalize }} support<br>

    <b-table :items="limits" thead-class="d-none" striped hover />

    <b-btn v-b-modal.planSelector variant="primary">Change plan</b-btn>
    <b-modal id="planSelector" ref="planSelectorModal" title="Choose plan" hide-footer>
      <plan-selector :current-plan="plan" />
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
    plan: {
      type: [Object, Boolean],
      required: true
    }
  },
  computed: {
    limits() {
      return Object.entries(this.plan.limits).map(l => {
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
