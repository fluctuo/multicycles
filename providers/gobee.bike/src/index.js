import axios from 'axios'

const BASE_URL = 'http://aws.gobee.bike/GobeeBike/bikes'
const api = axios.create({
  baseURL: BASE_URL
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
