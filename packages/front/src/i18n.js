import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const capacities = localStorage.getItem('capacities') && JSON.parse(localStorage.getItem('capacities'))

export default new VueI18n({
  locale: localStorage.getItem('lang') || (capacities && capacities.defaultLanguage) || 'en',
  fallbackLocale: 'en',
  messages: {
    en: require('./langs/en.json'),
    fr: require('./langs/fr.json'),
    cn: require('./langs/cn.json')
  }
})
