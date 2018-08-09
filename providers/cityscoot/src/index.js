import got from 'got'
import { point, polygon } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

const BASE_URL = 'https://api-v3.cityscoot.eu/api'
const SCOOTERS_URL = 'https://e192rk8dx7.execute-api.eu-west-2.amazonaws.com/dev/api/scooters/public/city'

class Cityscoot {
  constructor({ timeout } = {}) {
    this.cities = []
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

  getCities() {
    return got.get(`${BASE_URL}/v1/city`, { json: true }).then(({ body }) => {
      body.data.cities.forEach(city => {
        this.cities.push(city)
      })
    })
  }

  getCity({ lat, lng }) {
    let city
    const position = point([lng, lat])

    this.cities.forEach(c => {
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

    if (!this.cities.length) {
      await this.getCities()
    }

    const city = this.getCity({ lat, lng })

    if (!city) {
      throw new Error('Not Covered')
    }

    return got.get(`${SCOOTERS_URL}/${city.id}`, {
      json: true,
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Cityscoot
