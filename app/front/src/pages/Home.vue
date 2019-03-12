<template>
  <div class="wrapper">
    <div class="top">
      <menu-icon @click="open" class="icon"/>
      <router-link to="/search">
        <input
          v-model="$store.state.selectedAddress.name"
          type="text"
          :placeholder="$t('search.search')"
          class="adress-picker"
        >
      </router-link>

      <div class="left">
        <crosshair-icon class="icon" @click="centerOnGeolocation"/>
        <router-link to="/settings">
          <layers-icon class="icon"/>
        </router-link>
      </div>
    </div>
    <local-map v-if="centerReady"/>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { MenuIcon, CrosshairIcon, LayersIcon } from 'vue-feather-icons'
import LocalMap from '../components/Map'

import store from '../store'

export default {
  name: 'Home',
  components: {
    MenuIcon,
    CrosshairIcon,
    LayersIcon,
    LocalMap
  },
  beforeRouteEnter(to, from, next) {
    if (to.query && to.query.l) {
      store.dispatch('setCenter', to.query.l.split(','))
      store.dispatch('setMoved', true)
    }
    next()
  },
  mounted() {
    this.setDrawerEnable(false)
  },
  computed: mapState(['map', 'roundedLocation']),
  methods: {
    ...mapActions(['setDrawerEnable', 'centerOnGeolocation', 'setCenter']),
    open() {
      this.setDrawerEnable(true)
      this.$parent.toggle()
    },
    centerReady() {
      return this.map.center && this.roundedLocation
    }
  }
}
</script>

<style lang="scss">
@import '../../node_modules/leaflet/dist/leaflet.css';
@import '../app.scss';

.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: stretch;
}

.top {
  position: absolute;
  width: 100%;
  z-index: 401;
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  padding: 0 15px;

  .left {
    display: flex;
    flex-direction: column;
  }

  .icon {
    height: $iconSize;
    width: $iconSize;
    cursor: pointer;

    background: #ffffff;
    border-radius: 50%;
    color: green;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    padding: 5px;
    margin: 5px 0;
  }

  .adress-picker {
    border-radius: 5px;

    width: 100%;
    height: 40px;

    box-shadow: none;
    border: 2px solid $mainColor;
  }
}
</style>

