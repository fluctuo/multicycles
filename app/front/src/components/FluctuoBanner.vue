<template>
  <div class="banner">
    <div class="inner flex-container autogrid">
      <div>
        Multicycles.org is powered by
        <a href="https://fluctuo.com">
          <b>Fluctuo Data Flow</b> API
        </a>
        <div class="hideOnMobile">The best data on shared-mobility vehicles available in real-time.</div>
      </div>
      <div>
        <a href="https://fluctuo.com/data-flow/" class="btn--primary">Discover</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FluctuoBanner'
}
</script>

<style lang="scss" scoped>
@import '../app.scss';

.banner {
  background-color: $mainColor;
  color: #fff;
  padding: 10px;

  .inner {
    max-width: 900px;
    margin: 0px auto;
    align-items: center;
    justify-items: center;

    div > div {
      margin-right: 20px;
    }

    a {
      color: #fff;
    }
  }
}

@media (max-width: 480px) {
  .banner .inner {
    margin-bottom: 10px;
  }

  .hideOnMobile {
    display: none;
  }
}
</style>
