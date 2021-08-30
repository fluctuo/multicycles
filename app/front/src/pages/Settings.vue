<template>
  <div class="page">
    <div class="header">
      <a @click="setPage('home')">
        <arrow-left-circle-icon />
      </a>

      <h1>{{ $t('settings.title') }}</h1>
    </div>

    <div class="content">
      <div class="inner-content">
        <div class="install" v-if="hasInstallPromptEvent">
          <button @click="installApp()">
            <arrow-down-circle-icon></arrow-down-circle-icon>
            {{ $t('settings.installApp') }}
          </button>
        </div>
        <form>
          <label for="lang">{{ $t('settings.lang') }}:</label>
          <select v-model="$store.state.lang" :class="[$store.state.lang]" @change="setLang" id="lang">
            <option v-for="lang in langs" :value="lang.value" :key="lang.value">{{ lang.text }}</option>
          </select>

          <label for="lang">{{ $t('settings.providers') }}:</label>

          <div class="providers">
            <div
              v-for="provider in $store.state.providers"
              :key="provider.slug"
              v-bind:class="{ disabled: isProviderDisabled(provider.slug) }"
              @click="toggleProvider(provider.slug)"
            >
              <a href="#" :title="provider.name">
                <img v-if="logoSrc(provider)" :src="logoSrc(provider)" :alt="provider.name" class="logo" />
                {{ provider.name }}
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { ArrowLeftCircleIcon, ArrowDownCircleIcon } from 'vue-feather-icons'

export default {
  name: 'Settings',
  components: {
    ArrowLeftCircleIcon,
    ArrowDownCircleIcon
  },
  created() {
    this.getProviders()
  },
  data() {
    return {
      hasInstallPromptEvent: !!window.installPromptEvent,
      langs: [
        { text: 'Français', value: 'fr' },
        { text: 'English', value: 'en' },
        { text: '中文', value: 'zh' },
        { text: 'German', value: 'de' }
      ]
    }
  },
  computed: mapGetters(['isProviderDisabled']),
  methods: {
    ...mapActions(['setLang', 'toggleProvider', 'getProviders']),
    ...mapMutations(['setPage']),
    installApp() {
      window.installPromptEvent.prompt()
    },
    logoSrc(provider) {
      return `https://cdn.fluctuo.com/providers/${provider.slug}.jpg`
    }
  }
}
</script>

<style lang="scss" scoped>
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
  justify-content: center;

  margin: -5px -5px;

  & > div {
    margin: 5px;
    width: 100%;
    max-width: 250px;
    border-radius: 5px;
    padding: 5px;
    background: white;

    a {
      color: black;
      text-decoration: none;
      font-size: 2rem;
    }

    &.disabled {
      filter: opacity(0.5) grayscale(1);
    }
  }
}

@media (max-width: 575px) {
  .providers > div {
    width: 100%;
    max-width: none;
  }
}
</style>
