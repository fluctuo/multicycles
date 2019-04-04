import Vue from 'vue'
if (process.env.NODE_ENV !== 'production') {
  Vue.config.devtools = true
  Vue.config.performance = true
}
import Axios from 'axios'
import VueAxios from 'vue-axios'
import VueAnalytics from 'vue-analytics'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import DrawerLayout from 'vue-drawer-layout'
import Navigation from 'vue-navigation'

import App from './App'
import router from './router'
import apolloProvider from './apollo'
import i18n from './i18n'
import store from './store'
import './registerServiceWorker'

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault()
  window.installPromptEvent = event
})

if (process.env.VUE_APP_UA_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.VUE_APP_UA_ANALYTICS,
    router,
    autoTracking: {
      exception: true
    }
  })
}

if (process.env.VUE_APP_SENTRY_KEY) {
  Raven.config(process.env.VUE_APP_SENTRY_KEY)
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.config.productionTip = false

Vue.use(
  VueAxios,
  Axios.create({
    baseURL: process.env.VUE_APP_API_URL
  })
)

Vue.use(DrawerLayout)
Vue.use(Navigation, { router, store })

Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})

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
