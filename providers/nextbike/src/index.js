import got from 'got'
import { point } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import bboxPolygon from '@turf/bbox-polygon'
import Cacheman from 'cacheman'

const BASE_URL = 'https://api.nextbike.net'

class Nextbike {
  constructor({ timeout, datastore = {} } = {}) {
    this.datastore = {
      store: datastore.store || new Cacheman(),
      ttl: {
        cities: (datastore.ttl && datastore.ttl.cities) || 1 * 60 * 60
      }
    }
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

  async getCities(config = {}) {
    let cities = await this.datastore.store.get(`nextbike|cities`)

    if (cities || config.force) {
      return cities
    } else {
      return got.get(`${BASE_URL}/maps/nextbike-live.json`, { json: true }).then(async ({ body }) => {
        let cities = []

        body.countries.forEach(country => {
          country.cities.forEach(city => {
            delete city.places
            cities.push(city)
          })
        })

        await this.datastore.store.set(`cityscoot|cities`, cities, this.datastore.ttl.cities)
        return cities
      })
    }
  }

  async getCity({ lat, lng }, config) {
    let city
    let cities = await this.datastore.store.get(`cityscoot|cities`)

    if (!cities) {
      cities = await this.getCities(config)
    }

    const position = point([lng, lat])

    cities.forEach(c => {
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

    if (!await this.datastore.store.get(`nextbike|cities`)) {
      await this.getCities(config)
    }

    const city = await this.getCity({ lat, lng }, config)

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
