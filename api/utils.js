import providersLocations from './providersLocations'

const languageCountry = {
  France: 'fr',
  China: 'cn'
}

export default {
  getLanguage(country) {
    return languageCountry[country] || 'en'
  },
  getProviders(city, country) {
    return providersLocations[city] || providersLocations[country] || ['gobee', 'ofo', 'mobike', 'yobike', 'jump']
  }
}
