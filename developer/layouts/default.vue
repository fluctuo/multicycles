<template>
  <div class="content">
    <navbar/>
    <nuxt class="all-height"/>
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

.content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.all-height {
  flex-grow: 1;
}
</style>
