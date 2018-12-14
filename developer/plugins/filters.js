import Vue from 'vue'
import moment from 'moment'

Vue.filter('ago', val => moment(val).fromNow())
Vue.filter('currentMonth', val => moment(val).format('MMMM YY'))
Vue.filter('format', (val, format) => moment(val).format(format))
Vue.filter('capitalize', val => val.charAt(0).toUpperCase() + val.slice(1))
Vue.filter('money', val => `${Number(val / 100).toFixed(2)} €`)
