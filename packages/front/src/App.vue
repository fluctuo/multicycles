<template>
  <div class="wrapper">
    <header>
      <router-link to="/">Mutlicycles.org</router-link>
      &nbsp;|&nbsp;
      <router-link to="/about">About</router-link>
    </header>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import '../node_modules/knacss/sass/knacss.scss';

html,
body {
  height: 100%;
}

header {
  height: 40px;
}

.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: stretch;
}
</style>
