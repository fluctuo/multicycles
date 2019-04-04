<template>
  <div class="txtcenter">
    <a :href="loginUrl('google')">
      <img src="../assets/btn_google_signin_light_normal_web@2x.png" width="191" alt>
    </a>
  </div>
</template>

<script>
export default {
  methods: {
    loginUrl(service) {
      return `${process.env.VUE_APP_API_URL}/auth/${service}`
    }
  }
}
</script>
