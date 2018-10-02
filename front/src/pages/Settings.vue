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

        <div class="providers">
          <div v-for="provider in $store.state.providers" :key="provider.slug" v-bind:class="{disabled: isProviderDisabled(provider.slug)}" @click="toggleProvider(provider.slug)">
            <img v-if="logoSrc(provider)" :src="logoSrc(provider)" alt="logo" class="logo">
          </div>
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
      langs: [{ text: 'Français', value: 'fr' }, { text: 'English', value: 'en' }, { text: '中文', value: 'cn' }, { text: 'German', value: 'de'}]
    }
  },
  computed: mapGetters(['isProviderDisabled']),
  methods: {
    ...mapActions(['setLang', 'toggleProvider']),
    installApp() {
      window.installPromptEvent.prompt()
    },
    logoSrc(provider) {
      let logo
      try {
        logo = require(`../assets/providers/${provider.slug}.jpg`)
      } catch (e) {

      }

      return logo
    }
  }
}
</script>


<style lang="scss">
@import '../app.scss';

form {
  display: flex;
  flex-direction: column;

  label {
    font-size: 2.4rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
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

.providers {
  display: flex;
  flex-wrap: wrap;

  margin: -5px -5px;

  &>div {
    margin: 5px;

    &.disabled {
      filter: opacity(0.6) grayscale(1);
    }
  }
}
</style>

