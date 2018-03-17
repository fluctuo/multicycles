import querystring from 'querystring'
import axios from 'axios'

const BASE_URL = 'https://mwx.mobike.com/mobike-api'

class Mobike {
  constructor({ timeout } = {}) {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: timeout || 2000
    })
  }

  getBicyclesByLatLng({ lat: latitude, lng: longitude } = {}, config = {}) {
    if (!latitude || !longitude) {
      throw new Error('Missing lat/lng')
    }

    return this.api.post(
      '/rent/nearbyBikesInfo.do',
      querystring.stringify({
        latitude,
        longitude
      }),
      config
    )
  }
}

export default Mobike
