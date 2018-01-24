import axios from 'axios'

const BASE_URL = 'https://one.ofo.com'
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 2000
})

export default {
  getOTP({ tel, ccc }) {
    return api.post('/verifyCode_v2', {
      tel,
      ccc,
      type: 1,
      lat: 48.85,
      lng: 2.37
    })
  },
  login({ tel, code, ccc }) {
    return api.post('/api/login_v2', {
      tel,
      code,
      ccc,
      lat: 48.85,
      lng: 2.37
    })
  },
  getBicyclesByLatLng({ lat, lng, token } = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return api.post('/nearbyofoCar', {
      lat,
      lng,
      token,
      source: 2
    })
  }
}
