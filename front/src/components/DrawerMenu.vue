<template>
  <div class="drawer">
    <ul>
      <li>
        <img src="/static/bicyclist.svg" alt="mutlicycles logo" class="logo">
      </li>
      <li>
        <router-link to="/" @click.native="handleToggleDrawer">
          {{ $t('home.map') }}
        </router-link>
      </li>
      <li>
        <router-link to="/settings" @click.native="handleToggleDrawer">
          {{ $t('settings.title') }}
        </router-link>
      </li>
      <li>
        <router-link to="/about" @click.native="handleToggleDrawer">
          {{ $t('about.title') }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    handleToggleDrawer() {
      this.$parent.toggle()
    }
  }
}
</script>


<style lang="scss">
@import '../app.scss';

.drawer {
  background: $mainColor;
  height: 100%;

  text-align: center;
  font-size: 3em;

  .logo {
    height: 100px;
    margin-bottom: 20px;
  }

  ul {
    padding: 0 40px;

    li {
      list-style: none;
      padding: 10px 0;
    }

    li + li {
      border-top: 1px solid rgba(255, 255, 255, 0.5);
    }
  }

  a {
    text-decoration: none;
    color: #fff;
    width: 100%;
    display: inline-block;
    height: 100%;
    transition: 0.3s;

    &:hover {
      background-color: #ffffff40;
      border-radius: 10px;
    }
  }
}
</style>
