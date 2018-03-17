import axios from 'axios'

const BASE_URL = 'https://appaws.gobee.bike/GobeeBike/bikes'

class GobeeBike {
  constructor({ timeout } = {}) {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: timeout || 2000
    })
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return this.api.get('/near_bikes', {
      ...config,
      params: {
        lat,
        lng
      }
    })
  }
}

export default GobeeBike
