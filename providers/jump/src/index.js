import axios from 'axios'
import getZone from './zones'

const endpoints = {
  dc: 'https://dc.jumpmobility.com/opendata',
  sf: 'https://sf.jumpmobility.com/opendata'
}

const api = axios.create({
  timeout: 2000
})

function getEndpoint(lat, lng) {
  const zone = getZone(lat, lng)
  return zone ? endpoints[zone] : null
}

export default {
  getBicyclesByLatLng({ lat, lng } = {}) {
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

    return api.get(`${endpoint}/free_bike_status.json`)
  }
}
