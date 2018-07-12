<template>
  <div class="wrapper">
    <settings-panel />
    <div class="header">
      <img src="/static/bicyclist.svg" alt="mutlicycles logo" style="height: 30px">
      &nbsp;
      <router-link to="/">
        Multicycles
      </router-link>
      &nbsp;|&nbsp;
      <router-link to="/about">
        {{ $t('about.title') }}
      </router-link>

      <a @click="toggleSettingPanel" class="settings">
        <settings-icon></settings-icon>
      </a>

    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { SettingsIcon } from 'vue-feather-icons'

import settingsPanel from './components/SettingsPanel'

export default {
  name: 'app',
  components: {
    settingsPanel,
    SettingsIcon
  },
  methods: mapActions(['toggleSettingPanel'])
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
  font-size: 1.3em;

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

.settings {
  z-index: 10001;
  position: absolute;
  right: 10px;
  line-height: 1;
}
</style>
