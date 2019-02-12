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

      <crosshair-icon class="icon" @click="centerOnGeolocation"/>
    </div>
    <local-map/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { MenuIcon, CrosshairIcon } from 'vue-feather-icons'
import LocalMap from '../components/Map'

import store from '../store'

export default {
  name: 'Home',
  components: {
    MenuIcon,
    CrosshairIcon,
    LocalMap
  },
  beforeRouteEnter(to, from, next) {
    if (to.query && to.query.l) {
      store.state.map.center = to.query.l.split(',')
      store.state.moved = true
    }
    next()
  },
  mounted() {
    this.setDrawerEnable(false)
  },
  methods: {
    ...mapActions(['setDrawerEnable', 'centerOnGeolocation', 'setCenter']),
    open() {
      this.setDrawerEnable(true)
      this.$parent.toggle()
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

  .icon {
    height: $iconSize;
    width: $iconSize;
    cursor: pointer;

    background: #ffffff;
    border-radius: 50%;
    color: green;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    padding: 5px;
  }

  .adress-picker {
    border-radius: 5px;

    width: 100%;
    height: 100%;

    box-shadow: none;
    border: 2px solid $mainColor;
  }
}
</style>

