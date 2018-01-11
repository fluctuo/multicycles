<template>
  <div class="settings-panel" :class="{hide: !$store.state.settingPanel}">
    <h2>{{ $t('settings.title')}}</h2>

      <form>
        <label for="lang">{{ $t('settings.lang') }}:</label>
        <select v-model="$store.state.lang" :class="[$store.state.lang]" @change="setLang" id="lang">
          <option v-for="lang in langs" :value="lang.value" :key="lang.value">{{ lang.text }}</option>
        </select>
      </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SettingsPanel',
  data() {
    return {
      langs: [
        { text: 'Français', value: 'fr' },
        { text: 'English', value: 'en' },
        { text: '中文', value: 'cn' }
      ]
    }
  },
  methods: mapActions(['setLang'])
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

  &.hide {
    display: none;
  }
}

form {
  display: flex;
  flex-direction: column;
}
</style>

