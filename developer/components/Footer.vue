<template>
  <footer id="footer" class="pt-5 pb-5 bg-dark">
    <b-container>
      <b-row align="center">
        <b-col>
          <logo/>
        </b-col>
        <b-col align="center">
          <a title="Realtime application protection" href="https://www.sqreen.io/?utm_source=badge"><img style="width:109px;height:36px" src="https://s3-eu-west-1.amazonaws.com/sqreen-assets/badges/20171107/sqreen-light-badge.svg" alt="Sqreen | Runtime Application Protection" /></a>
          <a title="Error Tracking Software — JavaScript, Python, PHP, Ruby, more" href="https://sentry.io"><img src="/sentry.png" alt="Sentry Logo"></a>
          <a title="Never Compromise on Identity" href="http://auth0.com"><img src="/auth0.png" alt="Auth0 Logo"></a>
        </b-col>
        <b-col align="center">
          <h5>Contact</h5>
          <ul class="list-unstyled">
            <li>
              <a href="https://twitter.com/multicyclesOrg">
                <twitter-icon />
              </a>&nbsp;
              <a href="mailto:contact@multicycles.org">
                <mail-icon class="custom-class"></mail-icon>
              </a>
            </li>
          </ul>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>

<script>
import logo from '~/components/Logo.vue'
import { TwitterIcon, MailIcon } from 'vue-feather-icons'

export default {
  components: { logo, TwitterIcon, MailIcon }
}
</script>


<style lang="scss">
@import '~/scss/app.scss';

#footer {
  width: 100%;
  color: $light;
}
</style>
