<template>
  <div class="drawer">
    <ul>
      <li>
        <img src="/static/bicyclist.svg" alt="mutlicycles logo" class="logo">
      </li>
      <li>
        <router-link to="/" @click.native="handleToggleDrawer">
          <globe-icon /> {{ $t('home.map') }}
        </router-link>
      </li>
      <li>
        <router-link to="/settings" @click.native="handleToggleDrawer">
          <settings-icon /> {{ $t('settings.title') }}
        </router-link>
      </li>
      <li>
        <router-link to="/about" @click.native="handleToggleDrawer">
          <info-icon /> {{ $t('about.title') }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { GlobeIcon, SettingsIcon, InfoIcon } from 'vue-feather-icons'

export default {
  components: {
    GlobeIcon,
    SettingsIcon,
    InfoIcon
  },
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

  font-size: 2em;

  .logo {
    height: 100px;
    margin-bottom: 20px;
  }

  ul {
    padding: 0 40px;

    li {
      list-style: none;
      padding: 10px 0;

      a {
        padding: 0 20px;
      }
    }

    li:first-child {
      text-align: center;
    }

    li + li {
      border-top: 1px solid lighten($mainColor, 10%);
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
      color: #fff;
      text-decoration: none;
    }
  }
}
</style>
