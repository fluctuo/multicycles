import querystring from 'querystring'
import got from 'got'

const BASE_URL = 'https://api-prod.ibyke.io'

class Byke {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout
    }
  }

  getBicyclesByLatLng({ lat: latitude, lng: longitude } = {}, config = {}) {
    if (!latitude || !longitude) {
      throw new Error('Missing lat/lng')
    }

    return got.get(`${BASE_URL}/v2/bikes`, {
      json: true,
      query: {
        latitude,
        longitude
      },
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Byke
