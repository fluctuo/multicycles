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
      <active-ride />
      <search v-if="page === 'search'" />
      <settings v-else-if="page === 'settings'" />
      <about v-else-if="page === 'about'" />
      <account v-else-if="page === 'account'" />
      <home v-else />
    </div>
  </vue-drawer-layout>
  <local-map v-else />
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import DrawerMenu from './components/DrawerMenu'
import ActiveRide from './components/ActiveRide'

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
    LocalMap
  },
  computed: mapGetters(['drawerEnable', 'page', 'isEmbedded']),
  created() {
    if (window.location.search && window.location.search.match(/embedded=true/)) {
      this.setEmbedded(true)
    } else {
      if (window.location.search && window.location.search.match(/jwt=/)) {
        this.setPage('account')
      }

      this.login()
      this.startGeolocation()
    }
  },
  methods: {
    ...mapActions(['setDrawerEnable', 'login', 'startGeolocation', 'getZones']),
    ...mapMutations(['setPage', 'setEmbedded']),
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
</style>
