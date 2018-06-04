import got from 'got'
import getZone from './zones'

const endpoints = {
  dc: 'https://dc.jumpmobility.com/opendata',
  sf: 'https://sf.jumpmobility.com/opendata'
}

function getEndpoint(lat, lng) {
  const zone = getZone(lat, lng)
  return zone ? endpoints[zone] : null
}

class Jump {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'jump',
      website: 'https://jumpbikes.com/',
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.jumpmobility',
        ios: 'https://itunes.apple.com/app/id1251322970'
      }
    }
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    const endpoint = getEndpoint(lat, lng)

    if (!endpoint) {
      return Promise.resolve({
        statusCode: 200,
        body: {
          last_updated: +new Date(),
          ttl: 60,
          data: {
            bikes: []
          }
        }
      })
    }

    return got.get(`${endpoint}/free_bike_status.json`, {
      json: true,
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Jump
