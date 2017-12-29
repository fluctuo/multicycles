import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import VueAnalytics from 'vue-analytics'

import App from './App'
import router from './router'

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
