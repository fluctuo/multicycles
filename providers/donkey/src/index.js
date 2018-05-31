import got from 'got'

const BASE_URL = 'https://stables.donkey.bike/api'

class Donkey {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  getBicyclesByLatLng({ lat, lng, radius = 800 } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return got.get(`${BASE_URL}/public/availability/hubs`, {
      json: true,
      query: {
        radius,
        location: `${lat},${lng}`
      },
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Donkey
