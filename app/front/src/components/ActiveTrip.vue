<template>
  <div class="activeTrip-container">
    <transition name="slideDown">
      <div v-if="hasActiveTrips" class="activeTrip">
        <div>{{ $t('activeTrip.riding') }}</div>
        <button
          @click="showActiveTripModal = true"
          class="btn--ghost"
        >{{ $t('activeTrip.clickToDetail') }}</button>
      </div>
    </transition>
    <active-trip-modal v-if="hasActiveTrips && showActiveTripModal" @close="showActiveTripModal = false"></active-trip-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ActiveTripModal from './ActiveTripModal'

export default {
  name: 'ActiveTrip',
  components: {
    ActiveTripModal
  },
  data() {
    return {
      showActiveTripModal: false
    }
  },
  computed: mapState({
    hasActiveTrips: state => !!(state.activeTrips && state.activeTrips.length)
  })
}
</script>

<style lang="scss" scoped>
.activeTrip-container {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
}

.activeTrip {
  padding: 5px 0px;
  background-color: #007bff;
  text-align: center;
  color: #fff;
  font-size: 1.2em;
  font-weight: bold;
}
</style>

