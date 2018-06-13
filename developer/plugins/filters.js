import Vue from 'vue'
import moment from 'moment'

Vue.filter('ago', val => moment(val).fromNow())
