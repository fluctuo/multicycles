<template>
  <vue-drawer-layout
    ref="drawerLayout"
    :enable="drawerEnable"
    @slide-end="fixEnable"
    @mask-click="handleMaskClick"
    v-if="!isEmbedded"
  >
    <drawer-menu slot="drawer" />
    <div slot="content" class="wrapper">
      <fluctuo-banner v-if="page === 'home'" />
      <active-ride />
      <search v-if="page === 'search'" />
      <settings v-else-if="page === 'settings'" />
      <about v-else-if="page === 'about'" />
      <account v-else-if="page === 'account'" />
      <home v-else />
    </div>
  </vue-drawer-layout>
  <div v-else class="wrapper">
    <img src="./assets/logo.png" class="watermark" />
    <local-map />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import queryString from 'query-string'
import DrawerMenu from './components/DrawerMenu'
import ActiveRide from './components/ActiveRide'
import FluctuoBanner from './components/FluctuoBanner'

import Home from '@/pages/Home'
import LocalMap from '@/components/Map'
import Search from '@/pages/Search'
import Settings from '@/pages/Settings'
import About from '@/pages/About'
import Account from '@/pages/Account'

export default {
  name: 'app',
  components: {
    DrawerMenu,
    ActiveRide,
    Home,
    Search,
    Settings,
    About,
    Account,
    LocalMap,
    FluctuoBanner
  },
  computed: mapGetters(['drawerEnable', 'page', 'isEmbedded']),
  created() {
    if (window.location.search) {
      const params = queryString.parse(window.location.search)

      if (params.embedded === 'true') {
        this.setEmbedded(true)
      }

      if (params.jwt) {
        this.setPage('account')
      }

      if (params.l) {
        this.setCenter(params.l)
        this.setMoved(true)
      }

      if (params.autoReload === 'true') {
        this.setAutoReload(true)
      }
    }

    this.login()
    this.startGeolocation()
  },
  methods: {
    ...mapActions(['setDrawerEnable', 'login', 'startGeolocation', 'getZones', 'setCenter', 'setMoved']),
    ...mapMutations(['setPage', 'setEmbedded', 'setAutoReload']),
    fixEnable(visible) {
      if (visible) {
        this.setDrawerEnable(true)
      } else {
        this.setDrawerEnable(this.page === 'home' ? false : true)
      }
    },
    handleMaskClick() {
      this.$refs.drawerLayout.toggle(false)
    }
  }
}
</script>

<style lang="scss">
@import './app.scss';

html,
body {
  font-family: 'Poppins', sans-serif;
  height: 100%;
  overflow: hidden;
}

.header {
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $mainColor;
  color: #fff;
  font-weight: bold;
  font-size: 1.3rem;

  a {
    text-decoration: none;
    color: #fff;

    &:hover {
      color: #fff;
    }
  }
}

.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: stretch;
}

.watermark {
  width: 150px;
  position: absolute;
  z-index: 1000;
  bottom: 0px;
  left: 20px;
}

@media (max-width: 1025px) {
  .watermark {
    display: none;
  }
}
</style>
