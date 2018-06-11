<template>
  <div>
    <navbar/>
    <nuxt/>
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

<style>
html {
  position: relative;
  min-height: 100%;
}
body {
  margin-bottom: 250px;
}
</style>

