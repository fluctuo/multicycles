import providersLocations from './providersLocations'

const languageCountry = {
  France: 'fr',
  China: 'cn'
}

const allProviders = [
  'bird',
  'byke',
  'coup',
  'donkey',
  'gobeebike',
  'hellobike',
  'indigowheel',
  'jump',
  'lime',
  'mobike',
  'nextbike',
  'obike',
  'ofo',
  'pony',
  'spin',
  'whitebikes',
  'yobike'
]

function getLanguage(country) {
  return languageCountry[country] || 'en'
}

function getProviders(city, country, defaultToAll) {
  return providersLocations[city] || providersLocations[country] || (defaultToAll ? allProviders : [])
}

export { allProviders, getLanguage, getProviders }
