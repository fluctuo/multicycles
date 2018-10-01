<template>
  <div class="footer">
    Fabriqué en France
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss">
@import '../app.scss';

.footer {
  text-align: center;
  font-size: 1.2rem;
  color: lighten($mainColor, 20);
}
</style>
