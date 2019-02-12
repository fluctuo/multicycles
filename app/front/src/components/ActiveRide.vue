<template>
  <div class="activeride-container">
    <transition name="slideDown">
      <div v-if="hasActiveRides" class="activeRide">
        <div>{{ $t('ActiveRide.riding') }}</div>
        <button
          @click="showActiveRideModal = true"
          class="btn--ghost"
        >{{ $t('ActiveRide.clickToDetail') }}</button>
      </div>
    </transition>
    <active-ride-modal v-if="showActiveRideModal" @close="showActiveRideModal = false"></active-ride-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ActiveRideModal from './ActiveRideModal'

export default {
  name: 'ActiveRide',
  components: {
    ActiveRideModal
  },
  data() {
    return {
      showActiveRideModal: false
    }
  },
  computed: mapState({
    hasActiveRides: state => !!(state.activeRides && state.activeRides.length)
  })
}
</script>

<style lang="scss" scoped>
.activeride-container {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
}

.activeRide {
  padding: 5px 0px;
  background-color: #007bff;
  text-align: center;
  color: #fff;
  font-size: 1.2em;
  font-weight: bold;
}
</style>

