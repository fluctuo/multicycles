import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Settings from '@/pages/Settings'
import About from '@/pages/About'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
