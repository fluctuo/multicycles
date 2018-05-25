import querystring from 'querystring'
import axios from 'axios'

const BASE_URL = 'https://api-prod.ibyke.io'

class Byke {
  constructor({ timeout } = {}) {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: timeout
    })
  }

  getBicyclesByLatLng({ lat: latitude, lng: longitude } = {}, config = {}) {
    if (!latitude || !longitude) {
      throw new Error('Missing lat/lng')
    }

    return this.api.get('/v2/bikes', {
      ...config,
      params: {
        latitude,
        longitude
      }
    })
  }
}

export default Byke
