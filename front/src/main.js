import Vue from 'vue'
if (process.env.NODE_ENV !== 'production') {
  Vue.config.devtools = true
  Vue.config.performance = true
}
import Axios from 'axios'
import VueAxios from 'vue-axios'
import VueAnalytics from 'vue-analytics'
import VueApollo from 'vue-apollo'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import DrawerLayout from 'vue-drawer-layout'

import App from './App'
import router from './router'
import apolloProvider from './apollo'
import i18n from './i18n'
import store from './store'

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault()
  window.installPromptEvent = event
})

if (process.env.UA_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.UA_ANALYTICS,
    router,
    autoTracking: {
      exception: true
    }
  })
}

if (process.env.SENTRY_KEY) {
  Raven.config(process.env.SENTRY_KEY)
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.config.productionTip = false

Vue.use(
  VueAxios,
  Axios.create({
    baseURL: process.env.API_URL
  })
)

Vue.use(DrawerLayout)

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
