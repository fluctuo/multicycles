<template>
  <div class="flex-container">
    <div class="content">
      <h1>{{ $t('about.title') }}</h1>
      <p v-html="$t('about.one')"></p>
      <p v-html="$t('about.two')"></p>
      <p v-html="$t('about.three')"></p>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from './Footer'

export default {
  name: 'About',
  components: {
    Footer
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
