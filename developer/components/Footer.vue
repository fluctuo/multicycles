<template>
  <footer id="footer" class="mt-5 pt-5 pb-5 bg-dark">
    <b-container>
      <b-row align-v="center" align-h="center">
        <b-col>
          <logo/>
        </b-col>
        <b-col>
          <h5>Contact</h5>
          <ul class="list-unstyled">
            <li>
              <a href="https://twitter.com/multicyclesOrg">
                <twitter-icon />
              </a>&nbsp;
              <a href="mailto:hello@pierrickp.xyz">
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


<style>
#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  color: #fff;
}
</style>
