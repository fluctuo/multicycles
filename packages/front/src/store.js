import Vue from 'vue'
import Vuex from 'vuex'

import i18n from './i18n'

Vue.use(Vuex)

const state = {
  lang: localStorage.getItem('lang') || 'en',
  settingPanel: false
}

const getters = {}

const actions = {
  toggleSettingPanel({ commit }) {
    commit('toggleSettingPanel')
  },
  setLang: ({ commit }, event) => {
    commit('setLang', event.target.value)
  }
}

const mutations = {
  toggleSettingPanel(state) {
    state.settingPanel = !state.settingPanel
  },
  setLang(state, lang) {
    localStorage.setItem('lang', lang)
    i18n.locale = lang
    state.lang = lang
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
