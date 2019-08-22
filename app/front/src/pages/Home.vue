<template>
  <div class="wrapper">
    <div class="top">
      <menu-icon @click="open" class="icon" />
      <a @click="setPage('search')">
        <input
          v-model="$store.state.selectedAddress.name"
          type="text"
          :placeholder="$t('search.search')"
          class="adress-picker"
        />
      </a>

      <div class="left">
        <crosshair-icon class="icon" @click="centerOnGeolocation" />
        <a @click="setPage('settings')">
          <filter-icon class="icon" />
        </a>
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

import store from '../store'

function getUrlParams(search) {
  let hashes = search.slice(search.indexOf('?') + 1).split('&')
  let params = {}
  hashes.map(hash => {
    let [key, val] = hash.split('=')
    params[key] = decodeURIComponent(val)
  })

  return params
}

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
  created() {
    const search = getUrlParams(window.location.search)

    if (search.l) {
      store.dispatch('setCenter', search.l.split(','))
      store.dispatch('setMoved', true)
    }
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

