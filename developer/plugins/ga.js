import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

if (process.env.ANALYTICS_KEY) {
  Vue.use(VueAnalytics, {
    id: process.env.ANALYTICS_KEY
  })
}
