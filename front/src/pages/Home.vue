<template>
  <div class="wrapper">
    <div class="top">
      <menu-icon @click="open" class="menu" />
    </div>
    <local-map />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { MenuIcon } from 'vue-feather-icons'
import LocalMap from '../components/Map'

export default {
  name: 'Home',
  components: {
    MenuIcon,
    LocalMap
  },
  mounted() {
    this.setDrawerEnable(false)
  },
  methods: {
    ...mapActions(['setDrawerEnable']),
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
  z-index: 1000;
  display: flex;
  margin: 15px 20px;

  .menu {
    height: 50px;
    width: 50px;
  }
}
</style>

