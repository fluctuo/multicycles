<template>
  <div class="providers">
    <my-sub-account provider="lime"/>
    <my-sub-account provider="bird"/>
    <my-sub-account provider="tier"/>
    <my-sub-account provider="hive"/>
    <my-sub-account provider="circ"/>
    <my-sub-account provider="ufo"/>
    <my-sub-account provider="moow"/>
  </div>
</template>

<script>
import MySubAccount from './MySubAccount'

export default {
  name: 'MyAccount',
  components: {
    MySubAccount
  }
}
</script>

<style lang="scss" scoped>
.providers>div+div {
  border-top: 1px solid #fff;
}
</style>

