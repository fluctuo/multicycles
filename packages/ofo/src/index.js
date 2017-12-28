import axios from 'axios'

const BASE_URL = 'https://one.ofo.com'
const api = axios.create({
  baseURL: BASE_URL
})

export default {
  getBicyclesByLatLng({ lat, lng } = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return api.post('/nearbyofoCar', {
      lat,
      lng,
      source: 2,
      token: process.env.OFO_AUTH_TOKEN // auth token
    })
  }
}
