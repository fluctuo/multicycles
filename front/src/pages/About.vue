<template>
  <div class="page">
    <div class="header">
      <router-link :to="getPreviousPage()">
        <arrow-left-circle-icon/>
      </router-link>

      <h1>{{ $t('about.title') }}</h1>
    </div>

    <div class="content">
      <p v-html="$t('about.one')"></p>
      <p v-html="$t('about.two')"></p>
      <p v-html="$t('about.three')"></p>
      <p v-html="$t('about.four')"></p>
    </div>
    <Footer/>
  </div>
</template>

<script>
import { ArrowLeftCircleIcon } from 'vue-feather-icons'
import Footer from '../components/Footer'

export default {
  name: 'About',
  components: {
    ArrowLeftCircleIcon,
    Footer
  },
  methods: {
    getPreviousPage() {
      const previousHome = this.$store.state.navigation.routes[this.$store.state.navigation.routes.length - 2]
      return previousHome ? `/?VNK=${previousHome.replace('Home?', '')}` : '/'
    }
  }
}
</script>

<style lang="scss">
.flex-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: stretch;
}

.content {
  margin: 5px 25px;
  flex: 1;
}

.important {
  font-weight: bold;
}
</style>
