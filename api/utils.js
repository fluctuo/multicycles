import providersLocations from './providersLocations'

const languageCountry = {
  France: 'fr',
  China: 'cn'
}

const allProviders = [
  'bird',
  'byke',
  'callabike',
  'cityscoot',
  'coup',
  'donkey',
  // 'gobeebike',
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
  'wind',
  'yobike'
]

function getLanguage(country) {
  return languageCountry[country] || 'en'
}

export { allProviders, getLanguage }
