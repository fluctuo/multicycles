<template>
  <div class="wrapper">
    <settings-panel />
    <header>
      <img src="/static/bicyclist.svg" alt="mutlicycles logo" style="height: 30px">
      &nbsp;
      <router-link to="/">
        Multicycles
      </router-link>
      &nbsp;|&nbsp;
      <router-link to="/about">
        {{ $t('about.title') }}
      </router-link>

      <a @click="toggleSettingPanel" class="settings"><i data-feather="settings"></i></a>

    </header>
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import feather from 'feather-icons'

import settingsPanel from './components/SettingsPanel'

export default {
  name: 'app',
  components: {
    settingsPanel
  },
  mounted() {
    feather.replace()
  },
  methods: mapActions(['toggleSettingPanel'])
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Poppins');
@import '../node_modules/knacss/sass/knacss.scss';

$mainColor: rgb(18, 168, 11);

html,
body {
  font-family: 'Poppins', sans-serif;
  height: 100%;
}

header {
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
  position: absolute;
  right: 10px;
  line-height: 1;
}
</style>
