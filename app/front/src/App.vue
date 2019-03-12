<template>
  <vue-drawer-layout
    ref="drawerLayout"
    :enable="drawerEnable"
    @slide-end="fixEnable"
    @mask-click="handleMaskClick"
  >
    <drawer-menu slot="drawer"/>
    <div slot="content" class="wrapper">
      <active-ride/>
      <navigation>
        <router-view></router-view>
      </navigation>
    </div>
  </vue-drawer-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DrawerMenu from './components/DrawerMenu'
import ActiveRide from './components/ActiveRide'

export default {
  name: 'app',
  components: {
    DrawerMenu,
    ActiveRide
  },
  computed: mapGetters(['drawerEnable']),
  created() {
    this.login()
    this.getProviders()
    this.startGeolocation()
  },
  methods: {
    ...mapActions(['getProviders', 'setDrawerEnable', 'login', 'startGeolocation', 'getZones']),
    fixEnable(visible) {
      // if drawer closed and still on map, disable it
      if (this.$route.path === '/' && !visible) {
        this.setDrawerEnable(false)
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
