import Vue from 'vue'
import moment from 'moment'

Vue.filter('ago', val => moment(val).fromNow())
Vue.filter('capitalize', val => val.charAt(0).toUpperCase() + val.slice(1))
