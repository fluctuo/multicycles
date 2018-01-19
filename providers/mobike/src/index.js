import querystring from 'querystring'
import axios from 'axios'

const BASE_URL = 'https://mwx.mobike.com/mobike-api'
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 1500
})

export default {
  getBicyclesByLatLng({ lat: latitude, lng: longitude } = {}) {
    if (!latitude || !longitude) {
      throw new Error('Missing lat/lng')
    }

    return api.post(
      '/rent/nearbyBikesInfo.do',
      querystring.stringify({
        latitude,
        longitude
      })
    )
  }
}
