<template>
  <div class="drawer">
    <ul>
      <li>
        <img src="/bicyclist.svg" alt="mutlicycles logo" class="logo" />
      </li>
      <li>
        <a @click="moveToPage('home')">
          <globe-icon />
          &nbsp;{{ $t('home.map') }}
        </a>
      </li>
      <li>
        <a @click="moveToPage('settings')">
          <settings-icon />
          &nbsp;{{ $t('settings.title') }}
        </a>
      </li>
      <li>
        <a @click="moveToPage('about')">
          <info-icon />
          &nbsp;{{ $t('about.title') }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { GlobeIcon, SettingsIcon, InfoIcon } from 'vue-feather-icons'

export default {
  components: {
    GlobeIcon,
    SettingsIcon,
    InfoIcon
  },
  methods: {
    ...mapMutations(['setPage']),
    moveToPage(page) {
      this.setPage(page)
      this.$parent.toggle()
    },
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

  font-size: 2.4rem;
  max-width: 400px;

  .logo {
    height: 100px;
    margin-bottom: 20px;
  }

  ul {
    padding: 0 10px;

    li {
      list-style: none;
      padding: 10px 0;
      color: #fff;

      a {
        padding: 0 20px;
        display: flex;
        align-items: center;
        height: 45px;
        text-decoration: none;
        transition: 0.3s;
        cursor: pointer;

        &:hover {
          background-color: #ffffff40;
          border-radius: 5px;
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
