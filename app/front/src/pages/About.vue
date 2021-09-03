<template>
  <div class="page">
    <div class="header">
      <a @click="setPage('home')">
        <arrow-left-circle-icon />
      </a>

      <h1>{{ $t('about.title') }}</h1>
    </div>

    <div class="content">
      <div class="inner-content">
        <div v-html="$t('about.text')"></div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { ArrowLeftCircleIcon } from 'vue-feather-icons'
import Footer from '../components/Footer'

export default {
  name: 'About',
  components: {
    ArrowLeftCircleIcon,
    Footer
  },
  methods: {
    ...mapMutations(['setPage'])
  }
}
</script>

<style lang="scss" scoped>
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
  flex: 1;
}

.important {
  font-weight: bold;
}
</style>
