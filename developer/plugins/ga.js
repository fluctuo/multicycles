import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

export default ctx => {
  const analyticsKey = process.env.ANALYTICS_KEY || ctx.store.state.env.ANALYTICS_KEY
  if (analyticsKey) {
    Vue.use(VueAnalytics, {
      id: analyticsKey,
      router: ctx.app.router
    })
  }
}
