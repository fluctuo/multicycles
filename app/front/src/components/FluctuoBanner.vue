<template>
  <div class="banner" v-if="!bannerHidden">
    <div>
      Multicycles.org is powered by&nbsp;
      <a href="https://fluctuo.com">
        <b>Fluctuo Data Flow</b>&nbsp;API
      </a>
      <span class="hideOnMobile">
        <br />The best data on shared-mobility vehicles available in real-time.
      </span>
    </div>
    <div class="hide-banner">
      <a href="#" @click="hide()">close</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FluctuoBanner',
  data() {
    return {
      bannerHidden: false
    }
  },
  mounted() {
    this.bannerHidden = localStorage.getItem('bannerHidden')
  },

  methods: {
    hide() {
      localStorage.setItem('bannerHidden', true)
      this.bannerHidden = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../app.scss';

.banner {
  background-color: $mainColor;
  color: #fff;
  padding: 10px 30px;
  display: flex;

  a {
    color: #fff;
  }

  div:nth-child(2) {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;

    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: right;
    }
  }
}

@media (max-width: 480px) {
  .banner {
    padding: 10px 10px;
  }

  .hideOnMobile {
    display: none;
  }
}
</style>
