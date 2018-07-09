<template>
  <div class="selected-vehicle">
    <div class="detail">
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
        <a v-if="vehicle.provider.app.android" :href="vehicle.provider.app.android"><img src="../assets/android-badge.png" alt=""></a>
        <a v-if="vehicle.provider.app.ios" :href="vehicle.provider.app.ios"><img src="../assets/ios-badge.png" alt=""></a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['vehicle'],
  methods: {
    ...mapActions(['selectVehicle']),
    getVehicleTypeKey(vehicle) {
      let key = `vehicleType.${vehicle.type}`

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

  .detail {
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
  }
}
</style>
