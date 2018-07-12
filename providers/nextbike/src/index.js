import got from 'got'
import { point } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import bboxPolygon from '@turf/bbox-polygon'

const BASE_URL = 'https://api.nextbike.net'

class Nextbike {
  constructor({ timeout } = {}) {
    this.cities = []
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'Nextbike',
      slug: 'nextbike',
      website: 'https://www.nextbike.net/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=de.nextbike',
        ios: 'https://itunes.apple.com/app/id504288371'
      },
      deepLink: {
        android: 'nextbike://',
        ios: 'nextbike://'
      }
    }
  }

  getCities() {
    return got.get(`${BASE_URL}/maps/nextbike-live.json`, { json: true }).then(({ body }) => {
      body.countries.forEach(country => {
        country.cities.forEach(city => {
          delete city.places
          this.cities.push(city)
        })
      })
    })
  }

  getCity({ lat, lng }) {
    let city
    const position = point([lng, lat])

    this.cities.forEach(c => {
      if (
        booleanPointInPolygon(
          position,
          bboxPolygon([
            c.bounds.south_west.lng,
            c.bounds.south_west.lat,
            c.bounds.north_east.lng,
            c.bounds.north_east.lat
          ])
        )
      ) {
        city = c
      }
    })

    return city
  }

  async getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    if (!this.cities.length) {
      await this.getCities()
    }

    const city = this.getCity({ lat, lng })

    if (!city) {
      throw new Error('Not Covered')
    }

    return got.get(`${BASE_URL}/maps/nextbike-live.json`, {
      json: true,
      query: {
        city: city.uid
      },
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Nextbike
