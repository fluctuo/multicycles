import axios from 'axios'

const BASE_URL = 'https://stables.donkey.bike/api'

class Donkey {
  constructor({ timeout } = {}) {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: timeout
    })
  }

  getBicyclesByLatLng({ lat, lng, radius = 800 } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return this.api.get('/public/availability/hubs', {
      ...config,
      params: {
        radius,
        location: `${lat},${lng}`
      }
    })
  }
}

export default Donkey
