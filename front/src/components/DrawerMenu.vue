<template>
  <div class="drawer">
    <ul>
      <li>
        <img src="/static/bicyclist.svg" alt="mutlicycles logo" class="logo">
      </li>
      <li>
        <router-link to="/" @click.native="handleToggleDrawer">
          <globe-icon />&nbsp;{{ $t('home.map') }}
        </router-link>
      </li>
      <li>
        <router-link to="/settings" @click.native="handleToggleDrawer">
          <settings-icon />&nbsp;{{ $t('settings.title') }}
        </router-link>
      </li>
      <li>
        <router-link to="/about" @click.native="handleToggleDrawer">
          <info-icon />&nbsp;{{ $t('about.title') }}
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

  font-size: 1.5em;

  .logo {
    height: 100px;
    margin-bottom: 20px;
  }

  ul {
    padding: 0 10px;

    li {
      list-style: none;
      padding: 10px 0;

      a {
        padding: 0 20px;
        display: flex;
        align-items: center;
        height: 45px;
        text-decoration: none;
        color: #fff;
        transition: 0.3s;

        &:hover {
          background-color: #ffffff40;
          border-radius: 5px;
          color: #fff;
          text-decoration: none;
        }
      }
    }

    li:first-child {
      text-align: center;
    }

    li + li {
      border-top: 1px solid lighten($mainColor, 10%);
    }
  }
}
</style>
