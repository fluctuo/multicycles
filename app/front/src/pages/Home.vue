<template>
  <div class="wrapper">
    <div class="top">
      <div class="right">
        <menu-icon @click="open" class="icon" />
      </div>

      <div class="center">
        <a @click="setPage('search')">
          <input
            v-model="$store.state.selectedAddress.name"
            type="text"
            :placeholder="$t('search.search')"
            class="adress-picker"
          />
        </a>
      </div>

      <div class="left">
        <crosshair-icon class="icon" @click="centerOnGeolocation" />
        <filter-icon class="icon" @click="setPage('settings')" />
        <alert-circle-icon class="icon" @click="openMissingModal" />
      </div>
    </div>
    <local-map v-if="centerReady" />

    <missing-modal v-if="showMissingModal" @close="showMissingModal = false"></missing-modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { MenuIcon, CrosshairIcon, FilterIcon, AlertCircleIcon } from 'vue-feather-icons'
import LocalMap from '../components/Map'
import MissingModal from '../components/MissingModal'

export default {
  name: 'Home',
  components: {
    MenuIcon,
    CrosshairIcon,
    FilterIcon,
    LocalMap,
    AlertCircleIcon,
    MissingModal
  },
  data() {
    return {
      showMissingModal: false
    }
  },
  computed: mapState(['map', 'roundedLocation']),
  methods: {
    ...mapActions(['centerOnGeolocation', 'setCenter']),
    ...mapMutations(['setPage']),
    open() {
      this.$parent.toggle()
    },
    centerReady() {
      return this.map.center && this.roundedLocation
    },
    openMissingModal() {
      this.showMissingModal = true
    }
  }
}
</script>

<style lang="scss">
@import '~leaflet/dist/leaflet.css';
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
  height: 0;
  z-index: 401;
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  padding: 0 15px;
  @include respond-to('tiny') {
    padding: 0;
  }

  .left,
  .right {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 100%;

    @include respond-to('tiny') {
      margin: 0 5px;
    }
  }

  .center {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    height: 100%;
  }

  .icon {
    height: $iconSize;
    width: $iconSize;
    cursor: pointer;
    flex-shrink: 0;
    background: #ffffff;
    border-radius: 50%;
    color: green;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    padding: 5px;

    & + .icon {
      margin-top: 5px;
    }
  }

  .adress-picker {
    border-radius: 5px;
    max-width: 300px;
    width: 100%;
    height: 40px;
    box-shadow: none;
    border: 2px solid $mainColor;
  }
}
</style>

