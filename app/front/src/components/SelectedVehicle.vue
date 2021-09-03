<template>
  <div class="selected-vehicle">
    <div class="block">
      <div class="detail">
        <div>
          <div class="provider">
            <img v-if="logoSrc(vehicle.provider)" :src="logoSrc(vehicle.provider)" alt="logo" class="logo" />
            {{ vehicle.provider.name }}
          </div>
        </div>
        <div>
          <div v-if="vehicle.type == 'STATION'" class="no-shrink">
            <div v-if="vehicle.availableVehicles != null" class="available-vehicles">
              <span
                v-if="
                  vehicle.stationVehicleDetails &&
                    vehicle.stationVehicleDetails.length === 2 &&
                    vehicle.stationVehicleDetails[0].availableVehicles != null &&
                    vehicle.stationVehicleDetails[1].availableVehicles != null &&
                    vehicle.stationVehicleDetails[0].vehicleType === 'BIKE' &&
                    vehicle.stationVehicleDetails[1].vehicleType === 'BIKE' &&
                    vehicle.stationVehicleDetails[0].propulsion != vehicle.stationVehicleDetails[1].propulsion
                "
              >
                <span v-if="vehicle.stationVehicleDetails[0].propulsion === 'HUMAIN'">
                  {{ vehicle.stationVehicleDetails[1].availableVehicles
                  }}<img src="../assets/lightning.svg" class="attribute-nb" />
                  +
                  {{ vehicle.stationVehicleDetails[0].availableVehicles }}
                </span>
                <span
                  v-if="
                    vehicle.stationVehicleDetails[0].propulsion === 'ASSIST' ||
                      vehicle.stationVehicleDetails[0].propulsion === 'ELECTRIC'
                  "
                >
                  {{ vehicle.stationVehicleDetails[0].availableVehicles
                  }}<img src="../assets/lightning.svg" class="attribute-nb" />
                  +
                  {{ vehicle.stationVehicleDetails[1].availableVehicles }}
                </span>
              </span>
              <span v-else>{{ vehicle.availableVehicles }}</span>

              <span v-if="vehicle.provider.stationVehicleTypes && vehicle.provider.stationVehicleTypes.length === 1">
                &nbsp;{{
                  $tc('stationVehicleTypes.' + vehicle.provider.stationVehicleTypes[0], vehicle.availableVehicles)
                }}
              </span>
              <span v-else> &nbsp;{{ $t('selectedVehicle.vehicle') }} </span>
            </div>
            <span v-else class="type">{{ $t(getVehicleTypeKey(vehicle)) }}</span>

            <div v-if="vehicle.availableStands != null && !vehicle.isVirtual" class="available-stands">
              <span>{{ vehicle.availableStands }}</span>
              &nbsp;{{ $tc('selectedVehicle.free_docks', vehicle.availableStands) }}
            </div>
          </div>
          <div v-else class="type-attributes">
            <span class="type">
              <span v-if="vehicle.carModel">{{ vehicle.carModel }}</span>
              <span v-else>{{ $t(getVehicleTypeKey(vehicle)) }}</span>
              <span v-if="vehicle.carClass === 'MICRO'">&nbsp;(XS)</span>
              <span v-if="vehicle.carClass === 'SMALL'">&nbsp;(S)</span>
              <span v-if="vehicle.carClass === 'MEDIUM'">&nbsp;(M)</span>
              <span v-if="vehicle.carClass === 'LARGE'">&nbsp;(L)</span>
            </span>

            <div v-if="vehicle.publicId" class="vehicle-id">
              <span class="tag--primary">{{ vehicle.publicId }}</span>
            </div>

            <div class="attributes">
              <div v-if="vehicle.battery">{{ vehicle.battery }}%</div>
              <img
                v-if="
                  vehicle.propulsion === 'ELECTRIC' ||
                    vehicle.propulsion === 'ASSIST' ||
                    (vehicle.stationVehicleDetails &&
                      vehicle.stationVehicleDetails.length === 1 &&
                      vehicle.stationVehicleDetails[0].propulsion === 'ELECTRIC') ||
                    (vehicle.stationVehicleDetails &&
                      vehicle.stationVehicleDetails.length === 1 &&
                      vehicle.stationVehicleDetails[0].propulsion === 'ASSIST')
                "
                src="../assets/lightning.svg"
                class="attribute"
              />
              <img
                v-if="vehicle.attributes && vehicle.attributes.includes('GEARS')"
                src="../assets/cog.svg"
                class="attribute"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="pricesdetails" v-if="vehicle.pricing">
        <div v-for="(price, index) in pricingText(vehicle.pricing)" :key="index" class="prices">
          <span class="column-text"> {{ price.text }} </span>
          <span class="column-price">
            <span v-if="price.price"> {{ displayCurrency(price.price, vehicle.pricing.currency) }}</span>
            <span v-else-if="price.max">
              {{ displayCurrency(price.min || 0, vehicle.pricing.currency) }}-{{
                displayCurrency(price.max, vehicle.pricing.currency)
              }}
            </span>
            <span v-else>
              {{ $t('cost.StartingAt') }} {{ displayCurrency(price.min || 0, vehicle.pricing.currency) }}</span
            >
          </span>
        </div>
        <div v-if="vehicle.pricing.includeVat === false">{{ $t('cost.vatExcl') }}</div>
      </div>
      <div class="subdetail" v-if="!isEmbedded">
        <qrcode-scanner v-if="!hasActiveRides && unlockWhitelisted" :provider="vehicle.provider.slug" />
        <div v-else>
          <a v-if="isMobileAndDeeplink('ios')" :href="vehicle.provider.deepLink.ios" class="open-native">
            {{ $t('selectedVehicle.unlockInTheApp') }}&nbsp;
            <external-link-icon />
          </a>
          <a v-if="isMobileAndDeeplink('android')" :href="vehicle.provider.deepLink.android" class="open-native">
            {{ $t('selectedVehicle.unlockInTheApp') }}&nbsp;
            <external-link-icon />
          </a>
          <a
            v-if="(isComputer && vehicle.provider.app.ios) || isMobileAndDeeplink('ios', true)"
            :href="vehicle.provider.app.ios"
          >
            <img src="../assets/ios-badge.png" alt />
          </a>
          <a
            v-if="(isComputer && vehicle.provider.app.android) || isMobileAndDeeplink('android', true)"
            :href="vehicle.provider.app.android"
          >
            <img src="../assets/android-badge.png" alt />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import MobileDetect from 'mobile-detect'
import { ExternalLinkIcon } from 'vue-feather-icons'
import QrcodeScanner from './QrcodeScanner'

const md = new MobileDetect(window.navigator.userAgent)
const unlockWhitelist = []

export default {
  components: { ExternalLinkIcon, QrcodeScanner },
  props: ['vehicle'],
  data: () => ({
    detail: false,
    isAndroid: md.is('AndroidOS'),
    isiOs: md.is('iOS'),
    isComputer: md.phone() === null && md.tablet() === null
  }),
  computed: {
    ...mapGetters(['isEmbedded']),
    ...mapState({
      lang: state => state.lang,
      hasActiveRides: state => !!(state.activeRides && state.activeRides.length)
    }),
    unlockWhitelisted: function() {
      return unlockWhitelist.includes(this.vehicle.provider.slug)
    }
  },
  methods: {
    ...mapActions(['selectVehicle']),
    getVehicleTypeKey(vehicle) {
      let key = `vehicleType.${vehicle.type}`

      if (vehicle.type === 'STATION' && vehicle.isVirtual) {
        return 'vehicleType.VIRTUAL_STATION'
      }

      if (vehicle.type === 'BIKE' && vehicle.attributes && vehicle.attributes.includes('CARGO')) {
        return 'vehicleType.BIKE_CARGO'
      }

      if (vehicle.type === 'CAR' && vehicle.attributes && vehicle.attributes.includes('CARGO')) {
        return 'vehicleType.CAR_CARGO'
      }

      if (vehicle.attributes && vehicle.attributes.includes('TANDEM')) {
        return 'vehicleType.TANDEM'
      }

      return key
    },
    logoSrc(provider) {
      return `https://cdn.fluctuo.com/providers/${provider.slug}.jpg`
    },
    isMobileAndDeeplink(os, shouldMissingDeeplink) {
      const isMobile = md.is(os === 'android' ? 'AndroidOS' : 'iOS')
      const deeplink = shouldMissingDeeplink ? !this.vehicle.provider.deepLink[os] : this.vehicle.provider.deepLink[os]
      return isMobile && deeplink
    },
    pricingInterval(interval) {
      if (interval.find(p => !p.interval && !p.end)) {
        return null // has fixed price
      }

      const prices = interval.map(p => {
        let interval = p.interval ? p.interval : p.end - p.start
        let unitPrice = p.price / interval

        return { p, unitPrice, interval }
      })

      const sorted = [...prices].sort((a, b) => a.unitPrice - b.unitPrice)
      const first = sorted[0]
      const last = sorted[sorted.length - 1]

      if (first.unitPrice === last.unitPrice) {
        return {
          price: first.p.price,
          interval: first.p.interval
        }
      }

      const sameInterval = !sorted.find(a => a.interval !== first.interval)
      if (sameInterval) {
        return {
          min: first.p.price,
          max: last.p.price,
          interval: first.interval
        }
      }

      // Not the same price, not the same interval : "starting at"
      // min is the FIRST interval, not the MINIMUM price.
      return {
        min: prices[0].p.price,
        interval: prices[0].interval
      }
    },
    strIntervalMin(interval) {
      if (interval === 1) {
        return this.$tc('cost.perMinutes', 1)
      } else if (interval === 60) {
        return this.$tc('cost.perHours', 1)
      } else if (interval === 60 * 24) {
        return this.$t('cost.perDay')
      } else if (interval % 60 === 0) {
        return this.$tc('cost.perHours', interval / 60)
      } else {
        return this.$tc('cost.perMinutes', interval)
      }
    },
    strIntervalKm(interval) {
      return this.$tc('cost.perKm', interval)
    },
    displayCurrency(price, currency) {
      return price.toLocaleString(this.lang, { style: 'currency', currency, minimumFractionDigits: 0 })
    },
    pricingText(pricing) {
      const parts = []

      let startingAt = false

      if (pricing.perMin && pricing.perMin.length) {
        const p = this.pricingInterval(pricing.perMin)

        if (!p) {
          startingAt = true
        } else {
          parts.push({ text: this.strIntervalMin(p.interval), price: p.price, min: p.min, max: p.max })
        }
      }

      if (pricing.perKm && pricing.perKm.length) {
        const p = this.pricingInterval(pricing.perKm)

        if (!p) {
          startingAt = true
        } else {
          parts.push({ text: this.strIntervalMin(p.interval), price: p.price, min: p.min, max: p.max })
        }
      }

      if (startingAt) {
        let minPrice = pricing.unlock || 0

        const firstKm = pricing.firstKm && pricing.firstKm[0] && pricing.firstKm[0].start === 0
        if (firstKm) {
          minPrice += pricing.firstKm[0].price
        }
        const firstMin = pricing.perMin && pricing.perMin[0] && pricing.perMin[0].start === 0
        if (firstMin) {
          minPrice += pricing.perMin[0].price
        }

        parts.unshift({ text: this.$t('cost.tripPrice'), min: minPrice || 0 })
      } else if (pricing.unlock) {
        parts.unshift({ text: this.$t('cost.unlock'), price: pricing.unlock })
      }

      return parts
    }
  }
}
</script>

<style lang="scss">
@import '../app.scss';

$border-radius: 5px;

.selected-vehicle {
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 100%;
  bottom: 0;
  z-index: 817;

  .no-shrink {
    flex-shrink: 0;
    line-height: 22px;
  }

  .block {
    background-color: $mainColor;
    color: #fff;

    width: 100%;
    max-width: 400px;

    border-radius: $border-radius;
    margin: 0 10px 10px;

    display: flex;
    flex-direction: column;

    .detail {
      padding: 10px;

      display: flex;
      justify-content: space-between;
      flex-direction: row;
      align-items: center;

      .provider {
        font-size: 2.6rem;
        font-weight: bold;
        align-items: center;
        display: flex;
      }

      .logo {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }

      .attribute-nb {
        height: 20px;
      }
      .type-attributes {
        font-weight: bold;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-size: 1.4rem;

        .attributes {
          display: flex;

          .attribute {
            padding-left: 5px;
            height: 20px;
          }
        }
      }

      .available-vehicles {
        font-size: 1.6rem;

        span {
          font-weight: bold;
          font-size: 2.2rem;
        }
      }

      .available-stands {
        font-size: 1.2rem;

        span {
          font-weight: bold;
          font-size: 1.8rem;
        }
      }

      .vehicle-id {
        font-size: 1.6rem;
      }
    }

    .subdetail {
      padding: 10px 10px;
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
      background-color: lighten($mainColor, 20%);

      display: flex;
      justify-content: center;
      flex-direction: row-reverse;

      .open-native {
        color: $mainColor;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
        background: #fff;
        border-radius: $border-radius;
        text-decoration: none;
        font-weight: bold;
        padding: 10px 20px;
        display: flex;
      }
    }

    .pricesdetails {
      padding: 10px 10px;
      border-bottom-left-radius: $border-radius;
      border-bottom-right-radius: $border-radius;

      .prices {
        display: flex;

        .column-text {
          flex: 50%;
        }
        .column-price {
          flex: 50%;
          text-align: right;
        }
      }
    }
  }
}
</style>
