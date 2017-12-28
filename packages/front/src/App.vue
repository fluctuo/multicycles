<template>
  <div class="wrapper">
    <header>
      <a href="https://mulicycles.org/">Mutlicycles.org</a>
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
  // display: flex;
  // align-content: center;
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
