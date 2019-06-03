<template>
  <div>
    <no-ssr>
      <nuxt-child/>
      <div
        slot="placeholder"
        class="container d-flex align-items-center justify-content-center flex-column"
        style="height: 70vh"
      >
        <img src="~/assets/loading.svg" alt="Loading..." width="80px"> Logging in...
      </div>
    </no-ssr>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated']
}
</script>
