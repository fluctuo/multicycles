<template>
  <div>
    <no-ssr>
      <b-alert variant="danger" :show="auth && auth.user.disabled">
        <h4 class="alert-title">Blocked account</h4>
        <p>
          Your account are currently blocked
          <span>&nbsp;for the reason "{{ auth && auth.user.disabledReason }}"</span>.
        </p>
      </b-alert>
      <nuxt-child />
      <div
        slot="placeholder"
        class="container d-flex align-items-center justify-content-center flex-column"
        style="height: 70vh"
      >
        <img src="~/assets/loading.svg" alt="Loading..." width="80px" /> Logging in...
      </div>
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: ['authenticated'],
  computed: mapState(['auth'])
}
</script>
