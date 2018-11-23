<template>
  <nuxt-child />
</template>

<script>
export default {
  middleware: ['auth']
}
</script>
