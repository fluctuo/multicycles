import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default new VueI18n({
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'en',
  messages: {
    en: require('./langs/en.json'),
    fr: require('./langs/fr.json'),
    cn: require('./langs/cn.json')
  }
})
