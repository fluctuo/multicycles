<template>
  <div class="page">
    <div class="header">
      <a @click="setPage('home')">
        <arrow-left-circle-icon />
      </a>

      <h1>{{ $t('account.title') }}</h1>
    </div>

    <div class="content">
      <div class="inner-content">
        <p>{{ $t('account.intro') }}</p>

        <loader-icon v-if="isLoging" class="spinner" />
        <my-account v-else-if="isLogged" />
        <login v-else />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { ArrowLeftCircleIcon, LoaderIcon } from 'vue-feather-icons'
import queryString from 'query-string'
import Login from '../components/Login'
import MyAccount from '../components/MyAccount'
import Footer from '../components/Footer'

export default {
  name: 'Account',
  components: {
    ArrowLeftCircleIcon,
    LoaderIcon,
    Login,
    MyAccount,
    Footer
  },
  created() {
    if (window.location.search) {
      const params = queryString.parse(window.location.search)

      if (params.jwt) {
        this.isLoging = true
        window.localStorage.setItem('token', params.jwt)
        this.updateLocation()
        this.login()
      }
      this.isLoging = false
    }
  },
  data() {
    return {
      isLoging: true
    }
  },
  computed: {
    isLogged() {
      return this.$store.state.myAccount !== null
    }
  },
  methods: {
    ...mapActions(['login']),
    ...mapMutations(['setPage', 'updateLocation'])
  }
}
</script>

<style lang="scss" scoped>
.flex-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: stretch;
}

.important {
  font-weight: bold;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 100px;
  height: auto;
  margin: 50px auto;
  display: block;
  animation: spinner 4s linear infinite;
}
</style>
