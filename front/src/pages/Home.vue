<template>
  <div class="wrapper">
    <div class="top">
      <menu-icon @click="open" class="icon" />
      <router-link to="/search">
        <input type="text" placeholder="Address" class="adress-picker">
      </router-link>

      <compass-icon class="icon" @click="centerOnGeolocation"/>
    </div>
    <local-map />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { MenuIcon, CompassIcon } from 'vue-feather-icons'
import LocalMap from '../components/Map'

export default {
  name: 'Home',
  components: {
    MenuIcon,
    CompassIcon,
    LocalMap
  },
  mounted() {
    this.setDrawerEnable(false)
  },
  methods: {
    ...mapActions(['setDrawerEnable', 'centerOnGeolocation']),
    open() {
      this.setDrawerEnable(true)
      this.$parent.toggle()
    }
  }
}
</script>

<style lang="scss">
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
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  padding: 0 20px;

  .icon {
    height: 50px;
    width: 50px;
    cursor: pointer;
  }

  .adress-picker {
    border-radius: 5px;

    width: 100%;
    height: 100%;
  }
}
</style>

