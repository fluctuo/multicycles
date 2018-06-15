<template>
  <div>
    <navbar/>
    <nuxt class="push-footer"/>
    <my-footer/>
  </div>
</template>

<script>
import navbar from '~/components/Navbar.vue'
import myFooter from '~/components/Footer.vue'

export default {
  components: {
    navbar,
    myFooter
  }
}
</script>

<style lang="scss">
@import '~/scss/app.scss';
@import 'highlight.js/styles/tomorrow-night-eighties.css';

html {
  position: relative;
  min-height: 100%;
}

.push-footer {
  margin-bottom: 250px;
}
</style>

