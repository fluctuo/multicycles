<template>
  <div class="page">
    <div class="header">
      <router-link to="/">
        <arrow-left-circle-icon />
      </router-link>

      <h1>
        {{ $t('settings.title')}}
      </h1>
    </div>

    <div class="content">
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ArrowLeftCircleIcon, ArrowDownCircleIcon } from 'vue-feather-icons'

export default {
  name: 'Settings',
  components: {
    ArrowLeftCircleIcon,
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
@import '../app.scss';

form {
  display: flex;
  flex-direction: column;
}

.install button {
  margin: 15px auto;
  background: #fff;
  padding: 10px 50px;
  display: block;
  border-radius: 5px;
  text-decoration: none;
  color: $mainColor;

  svg {
    margin-bottom: -6px;
    margin-right: 5px;
  }
}
</style>

