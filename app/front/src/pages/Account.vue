<template>
  <div class="page">
    <div class="header">
      <router-link :to="getPreviousPage()">
        <arrow-left-circle-icon/>
      </router-link>

      <h1>{{ $t('account.title') }}</h1>
    </div>

    <div class="content">
      <p>{{ $t('account.intro') }}</p>
      <my-account v-if="isLogged"/>
      <login v-else/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { ArrowLeftCircleIcon } from 'vue-feather-icons'
import Login from '../components/Login'
import MyAccount from '../components/MyAccount'
import Footer from '../components/Footer'

export default {
  name: 'Account',
  components: {
    ArrowLeftCircleIcon,
    Login,
    MyAccount,
    Footer
  },
  created() {
    if (window.location.search) {
      const hashParsed = window.location.search.match(/jwt=(.+?)(?:&|$)/m)

      if (hashParsed[1]) {
        window.localStorage.setItem('token', hashParsed[1])
        this.login()
      }
    }
  },
  computed: {
    isLogged() {
      return this.$store.state.myAccount !== null
    }
  },
  methods: {
    ...mapActions(['login']),
    getPreviousPage() {
      const previousHome = this.$store.state.navigation.routes[this.$store.state.navigation.routes.length - 2]
      return previousHome ? `/?VNK=${previousHome.replace('Home?', '')}` : '/'
    }
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

.content {
  max-width: 576px;
  margin: 5px auto !important;
  flex: 1;
}

.important {
  font-weight: bold;
}
</style>
