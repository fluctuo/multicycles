<template>
  <div class="providers">
    <my-sub-account provider="lime"/>
    <my-sub-account provider="bird"/>
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

