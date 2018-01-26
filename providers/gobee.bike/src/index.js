import axios from 'axios'

const BASE_URL = 'https://appaws.gobee.bike/GobeeBike/bikes'
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 2000
})

export default {
  getBicyclesByLatLng({ lat, lng } = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return api.get('/near_bikes', {
      params: {
        lat,
        lng
      }
    })
  }
}
