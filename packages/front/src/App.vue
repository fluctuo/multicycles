<template>
  <div class="wrapper">
    <header>
      <img src="/static/bicyclist.svg" alt="mutlicycles logo" style="height: 30px">
      &nbsp;
      <router-link to="/">
        Multicycles
      </router-link>
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
@import url('https://fonts.googleapis.com/css?family=Poppins');
@import '../node_modules/knacss/sass/knacss.scss';

html,
body {
  font-family: 'Poppins', sans-serif;
  height: 100%;
}

header {
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(18, 168, 11);
  color: #fff;
  font-weight: bold;
  font-size: 1.3em;

  a {
    text-decoration: none;
    color: #fff;

    &:hover {
      color: #fff;
    }
  }
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
