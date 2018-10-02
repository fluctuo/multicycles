import Vue from 'vue'
import VueI18n from 'vue-i18n'

import getlanguage from './language'

Vue.use(VueI18n)

export default new VueI18n({
  locale: getlanguage(),
  fallbackLocale: 'en',
  messages: {
    en: require('./langs/en.json'),
    fr: require('./langs/fr.json'),
    zh: require('./langs/zh.json'),
    de: require('./langs/de.json')
  }
})
