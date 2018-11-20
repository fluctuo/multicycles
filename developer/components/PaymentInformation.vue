<template>
  <b-row v-if="data">
    <b-col>
      <b>{{ data.brand }}</b> ending in {{ data.last4 }}<br>
      expires {{ data.expMonth }} / {{ data.expYear }}
    </b-col>
    <b-col cols="auto" class="d-flex">
      <b-link class="d-flex align-items-center" @click="removePayementInformation(data.id)"><Trash2Icon /> Remove</b-link>
    </b-col>
  </b-row>
  <b-row v-else>
    <b-col>
      <b-btn variant="primary" @click="$root.$emit('openCreditCardModal')">Add credit card</b-btn>
    </b-col>
  </b-row>
</template>

<script>
import gql from 'graphql-tag'
import { Trash2Icon, Edit2Icon } from 'vue-feather-icons'
import { mapActions } from 'vuex'

export default {
  components: { Trash2Icon, Edit2Icon },
  props: {
    payementInformation: {
      type: [Boolean, Object],
      default: () => false
    }
  },
  data() {
    return {
      data: this.payementInformation
    }
  },
  watch: {
    payementInformation(payementInformation) {
      this.data = payementInformation
    }
  },
  created() {
    this.data = this.payementInformation
  },
  methods: {
    ...mapActions(['removePayementInformation'])
  }
}
</script>
