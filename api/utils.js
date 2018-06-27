import providersLocations from './providersLocations'

const languageCountry = {
  France: 'fr',
  China: 'cn'
}

export default {
  getLanguage(country) {
    return languageCountry[country] || 'en'
  },
  getProviders(city, country, defaultToAll) {
    return (
      providersLocations[city] ||
      providersLocations[country] ||
      (defaultToAll
        ? [
            'bird',
            'byke',
            'coup',
            'donkey',
            'gobeebike',
            'indigowheel',
            'jump',
            'lime',
            'mobike',
            'obike',
            'ofo',
            'pony',
            'spin',
            'whitebikes',
            'yobike'
          ]
        : [])
    )
  }
}
