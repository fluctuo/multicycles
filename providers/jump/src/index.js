import axios from 'axios'
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
    this.api = axios.create({
      timeout: timeout || 2000
    })
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    const endpoint = getEndpoint(lat, lng)

    if (!endpoint) {
      return Promise.resolve({
        data: {
          last_updated: +new Date(),
          ttl: 60,
          data: {
            bikes: []
          }
        }
      })
    }

    return this.api.get(`${endpoint}/free_bike_status.json`, config)
  }
}

export default Jump
