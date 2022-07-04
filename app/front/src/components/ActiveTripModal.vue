<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3>
              {{ $t('ActiveTripModal.header') }}{{ activeTrip.provider.name }} {{ tripIcon
              }}{{ activeTrip.vehicleFriendlyId }}
            </h3>
          </div>

          <div class="modal-body">
            <p>{{ startFromNow }}</p>
            <button class="btn--success" :disabled="stoping" @click="stop()">
              Stop trip
              <loader-icon v-if="stoping" class="spinner" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import { LoaderIcon } from 'vue-feather-icons'
import gql from 'graphql-tag'

function fancyTimeFormat(time) {
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600)
  var mins = ~~((time % 3600) / 60)
  var secs = ~~time % 60

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = ''

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs
  return ret
}
export default {
  name: 'ActiveTripModal',
  components: {
    LoaderIcon
  },
  data() {
    return { startFromNow: 0, stoping: false, getStripeInformation: {} }
  },
  mounted() {
    this.startUpdater()
  },
  beforeDestroy() {
    this.stopUpdater()
  },
  created() {
    const seconds = new Date().valueOf() / 1000 - this.activeTrip.startedAt
    this.startFromNow = fancyTimeFormat(seconds)
  },
  computed: {
    activeTrips() {
      return this.$store.state.activeTrips || []
    },
    activeTrip() {
      return this.activeTrips[0]
    },
    tripIcon() {
      return (
        {
          CAR: '🚗',
          BIKE: '🚲',
          SCOOTER: '🛴',
          MOTORSCOOTER: '🛵'
        }[this.activeTrip.vehicleType] || this.activeTrip.vehicleType
      )
    }
  },
  methods: {
    ...mapActions(['login', 'stopMyTrip', 'getActiveTrips', 'getCompletedTrips']),
    startUpdater() {
      this.updater = setInterval(() => {
        const seconds = new Date().valueOf() / 1000 - this.activeTrip.startedAt
        this.startFromNow = fancyTimeFormat(seconds)
      }, 1000)
    },

    stopUpdater() {
      clearInterval(this.updater)
      this.updater = null
    },

    async stop() {
      this.stoping = true
      await this.stopMyTrip({ tripId: this.activeTrip.id, provider: this.activeTrip.provider.slug })
        .then(async res => {
          this.getActiveTrips()
          this.getCompletedTrips()

          if (res.paymentIntent && res.paymentIntent.status === 'requires_action') {
            const { stripePublishableKey, stripeAccountId } = this.getStripeInformation

            const stripe = window.Stripe(stripePublishableKey, {
              stripeAccount: stripeAccountId
            })

            await stripe.confirmCardPayment(res.paymentIntent.clientSecret)

            this.getCompletedTrips()
          }

          this.stoping = false
          return this.$emit('close')
        })
        .catch(() => (this.stoping = false))
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
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

.modal-container {
  width: 90%;
  max-width: 576px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;

  color: #000;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  font-size: 2em;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

button {
  display: flex;
  align-items: center;
  margin: 0 auto;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  margin: 0 5px;
  animation: spinner 4s linear infinite;
}
</style>
