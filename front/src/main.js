import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import VueAnalytics from 'vue-analytics'
import VueApollo from 'vue-apollo'
import ToggleButton from 'vue-js-toggle-button'

import App from './App'
import router from './router'
import apolloProvider from './apollo'
import i18n from './i18n'
import store from './store'

if (process.env.UA_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.UA_ANALYTICS,
    router,
    autoTracking: {
      exception: true
    }
  })
}

Vue.config.productionTip = false

Vue.use(
  VueAxios,
  Axios.create({
    baseURL: process.env.API_URL
  })
)

Vue.use(ToggleButton)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  apolloProvider,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})