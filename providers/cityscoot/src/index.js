import got from 'got'
import Cacheman from 'cacheman'
import { point, polygon } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

const BASE_URL = 'https://api-v3.cityscoot.eu/api'
const SCOOTERS_URL = 'https://e192rk8dx7.execute-api.eu-west-2.amazonaws.com/dev/api/scooters/public/city'

class Cityscoot {
  constructor({ timeout, datastore = {} } = {}) {
    this.datastore = {
      store: datastore.store || new Cacheman(),
      ttl: {
        cities: (datastore.ttl && datastore.ttl.cities) || 1 * 60 * 60,
        vehicles: (datastore.ttl && datastore.ttl.vehicles) || 2 * 60
      }
    }
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'Cityscoot',
      slug: 'cityscoot',
      website: 'https://www.cityscoot.eu/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.livebanner.cityscoot',
        ios: 'https://itunes.apple.com/app/id1011202160'
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  async getCities(config = {}) {
    let cities = await this.datastore.store.get(`cityscoot|cities`)

    if (cities || config.force) {
      return cities
    } else {
      return got.get(`${BASE_URL}/v1/city`, { json: true }).then(async ({ body }) => {
        await this.datastore.store.set(`cityscoot|cities`, body.data.cities, this.datastore.ttl.cities)
        return body.data.cities
      })
    }
  }

  async getCity({ lat, lng }, config) {
    const position = point([lng, lat])
    let city
    let cities = await this.datastore.store.get(`cityscoot|cities`)

    if (!cities) {
      cities = await this.getCities(config)
    }

    cities.forEach(c => {
      const properPolygon = [...c.polygon.map(p => [p[1], p[0]]), [c.polygon[0][1], c.polygon[0][0]]]

      if (booleanPointInPolygon(position, polygon([properPolygon]))) {
        city = c
      }
    })

    return city
  }

  async getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    if (!await this.datastore.store.get(`cityscoot|cities`)) {
      await this.getCities(config)
    }

    const city = await this.getCity({ lat, lng }, config)

    if (!city) {
      throw new Error('Not Covered')
    }

    const vehicles = await this.datastore.store.get(`cityscoot|vehicles|${city.id}`)

    if (!vehicles || config.force) {
      return got
        .get(`${SCOOTERS_URL}/${city.id}`, {
          json: true,
          timeout: this.config.timeout,
          ...config
        })
        .then(async result => {
          await this.datastore.store.set(`cityscoot|vehicles|${city.id}`, result.body, this.datastore.ttl.vehicles)
          return result
        })
    } else {
      return Promise.resolve({
        statusCode: 304,
        body: vehicles
      })
    }
  }
}

export default Cityscoot
