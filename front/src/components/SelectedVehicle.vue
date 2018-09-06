<template>
  <div class="selected-vehicle">
    <div class="bloc">
      <div class="column">
        <img :src="logoSrc(vehicle.provider)" alt="logo" class="logo">
      </div>
      <div class="column">
        <div class="provider">
          {{ vehicle.provider.name }}
        </div>
        <div class="kind">
          {{ $t(getVehicleTypeKey(vehicle), vehicle)}}
        </div>
      </div>
      <div class="column">
        <a @click="detail = !detail" class="ride" href="#">
          Ride
          <arrow-right-circle-icon></arrow-right-circle-icon>
        </a>
      </div>

      <div v-if="detail" class="flex-container detail" style="width: 100%; flex-direction: row; margin: 20px 0;">
        <div v-if="showDeeplink()" class="w50 txtcenter item-center">
          {{ $t('selectedVehicle.ihaveanaccount') }}
          <div>
            <a v-if="isiOs && vehicle.provider.deepLink.ios" :href="vehicle.provider.deepLink.ios">{{ $t('selectedVehicle.openApp') }}</a>
            <a v-if="isAndroid && vehicle.provider.deepLink.android" :href="vehicle.provider.deepLink.android">{{ $t('selectedVehicle.openApp') }}</a>
          </div>
        </div>

        <div class="w50 txtcenter item-center">
          <div v-if="vehicle.provider.discountCode">
            {{ $t('selectedVehicle.useDiscountCode') }}<br/>
            <span v-html="renderDiscountCode(vehicle.provider.discountCode)"></span>
          </div>
          {{ $t('selectedVehicle.downloadApp') }}
          <div>
            <a v-if="(isComputer || isiOs) && vehicle.provider.app.ios" :href="vehicle.provider.app.ios"><img src="../assets/ios-badge.png" alt=""></a>
            <a v-if="(isComputer || isAndroid) && vehicle.provider.app.android" :href="vehicle.provider.app.android"><img src="../assets/android-badge.png" alt=""></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MobileDetect from 'mobile-detect'
import { ArrowRightCircleIcon } from 'vue-feather-icons'

const md = new MobileDetect(window.navigator.userAgent)

export default {
  components: {
    ArrowRightCircleIcon
  },
  props: ['vehicle'],
  data: () => ({
    detail: false,
    isAndroid: md.is('AndroidOS'),
    isiOs: md.is('iOS'),
    isComputer: md.phone() === null && md.tablet() === null
  }),
  methods: {
    ...mapActions(['selectVehicle']),
    getVehicleTypeKey(vehicle) {
      let key = `vehicleType.${vehicle.type}`

      if (vehicle.type === 'STATION' && vehicle.isVirtual) {
        return 'vehicleType.VIRTUAL_STATION'
      }

      if (vehicle.attributes && vehicle.attributes.includes('CARGO')) {
        return 'CARGO'
      }

      if (vehicle.attributes && vehicle.attributes.includes('TANDEM')) {
        return 'TANDEM'
      }

      if (vehicle.attributes && vehicle.attributes.includes('TANDEM')) {
        key += 'ChildSeat'
        return key
      }

      if (vehicle.attributes && vehicle.attributes.includes('ELECTRIC')) {
        key += 'Electric'
      }

      if (vehicle.attributes && vehicle.attributes.includes('GEARS')) {
        key += 'Gears'
      }

      return key
    },
    logoSrc(provider) {
      return require(`../assets/providers/${provider.slug}.jpg`)
    },
    renderDiscountCode(discount) {
      return discount.match(/^http/)
        ? `<a href="${discount}">${this.$i18n.t('selectedVehicle.discountLink')}</a>`
        : `${this.$i18n.t('selectedVehicle.discountCode')} <span class="discountCode">${discount}</span>`
    },
    showDeeplink() {
      return (
        (this.isAndroid && this.vehicle.provider.deepLink.android) || (this.isiOs && this.vehicle.provider.deepLink.ios)
      )
    }
  }
}
</script>

<style lang="scss">
@import '../app.scss';

.selected-vehicle {
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 100%;
  bottom: 0;
  z-index: 9999;

  .logo {
    width: 50px;
  }

  .bloc {
    z-index: 9999;
    background-color: $mainColor;
    color: #fff;

    width: 100%;
    max-width: 500px;

    border-radius: 5px;
    padding: 20px;
    margin: 0 10px 10px;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: space-between;

    .provider {
      font-size: 1.4em;
      font-weight: bold;
    }

    .kind {
      font-size: 0.85em;
    }

    .column {
      align-self: center;
    }

    .column:nth-child(2) {
      flex: 1 1 auto;
      margin: 0 15px;
    }

    .column:nth-child(3) {
      flex: 0 1 auto;
      text-align: end;

      a {
        display: block;
      }
    }

    .ride {
      border: 2px solid;
      padding: 12px;
      border-radius: 100px;
      color: #fff;
      text-decoration: none;

      svg {
        margin-bottom: -7px;
      }
    }

    .detail {
      border-top: 1px solid #fff;
      padding-top: 10px;

      a {
        color: #fff;
        font-weight: bold;
      }
    }
  }
}
</style>
