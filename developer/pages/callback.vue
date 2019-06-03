<template>
  <div class="container d-flex align-items-center justify-content-center flex-column">
    <img src="~/assets/loading.svg" alt="Loading..." width="80px"> Logging in...
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Callback',
  mounted() {
    this.handleLogin()
      .then(() => this.$router.push({ name: 'account' }))
      .catch(() => this.$router.push({ name: 'login' }))
  },
  methods: {
    ...mapActions(['handleLogin'])
  }
}
</script>


<style scoped>
.container {
  min-height: 70vh;
}
</style>
