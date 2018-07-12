<template>
  <transition name="fade">
    <div class="settings-panel" v-show="$store.state.settingPanel">
      <h2>{{ $t('settings.title')}}</h2>
      <div class="install" v-if="hasInstallPromptEvent">
        <button @click="installApp()">
          <arrow-down-circle-icon></arrow-down-circle-icon>
          {{ $t('settings.installApp')}}
        </button>
      </div>
      <form>
        <label for="lang">{{ $t('settings.lang') }}:</label>
        <select v-model="$store.state.lang" :class="[$store.state.lang]" @change="setLang" id="lang">
          <option v-for="lang in langs" :value="lang.value" :key="lang.value">{{ lang.text }}</option>
        </select>

        <label for="lang">{{ $t('settings.providers') }}:</label>

        <div v-for="provider in $store.state.providers" :key="provider" class="provider">
          <toggle-button :value="!isProviderDisabled(provider)" @change="toggleProvider(provider)"/>
          <span>{{ provider }}</span>
        </div>
      </form>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ArrowDownCircleIcon } from 'vue-feather-icons'

export default {
  name: 'SettingsPanel',
  components: {
    ArrowDownCircleIcon
  },
  data() {
    return {
      hasInstallPromptEvent: !!window.installPromptEvent,
      langs: [{ text: 'Français', value: 'fr' }, { text: 'English', value: 'en' }, { text: '中文', value: 'cn' }]
    }
  },
  computed: mapGetters(['isProviderDisabled']),
  methods: {
    ...mapActions(['setLang', 'toggleProvider']),
    installApp() {
      window.installPromptEvent.prompt()
    }
  }
}
</script>


<style lang="scss">
.settings-panel {
  z-index: 10000;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: center;
  align-items: center;

  padding: 25px 10px;

  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgb(18, 168, 11);
  color: #ffffff;

  text-align: center;

  .provider {
    justify-content: start;
    display: flex;

    span {
      margin-left: 5px;
      text-transform: capitalize;
    }
  }
}

form {
  display: flex;
  flex-direction: column;
}

.install button {
  margin: 15px 0;
  background: #fff;
  padding: 10px 50px;
  display: block;
  border-radius: 5px;
  text-decoration: none;

  svg {
    margin-bottom: -6px;
    margin-right: 5px;
  }
}
</style>

