import got from 'got'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point, polygon } from '@turf/helpers'

const BASE_URL = 'https://app.joincoup.com/api'

class Coup {
  constructor({ timeout } = {}) {
    this.markets = []
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'Coup',
      slug: 'coup',
      website: 'https://joincoup.com',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.joincoup.app',
        ios: 'https://itunes.apple.com/app/id1139725011'
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  getBusinessAreas(market, index) {
    return got
      .get(`${BASE_URL}/v3/markets/${market.id}/business_areas`, {
        json: true
      })
      .then(({ body }) => {
        market.business_areas = body.data.business_areas

        return market
      })
  }

  getMarkets() {
    return got
      .get(`${BASE_URL}/v3/markets`, {
        json: true
      })
      .then(({ body }) => Promise.all(body.data.markets.map((m, i) => this.getBusinessAreas(m, i))))
      .then(markets => {
        this.markets = markets
      })
  }

  async getMarket({ lat, lng }) {
    var market = null
    const p = point([lng, lat])

    if (!this.markets || !this.markets.length) {
      await this.getMarkets()
    }

    for (let m of this.markets) {
      for (let business_area of m.business_areas) {
        if (booleanPointInPolygon(p, polygon(business_area.polygon))) {
          market = m
          break
        }
      }
    }

    return market
  }

  async getObjects({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    const market = await this.getMarket({ lat, lng })

    if (!market) {
      throw new Error('Not Covered')
    }

    return got.get(`${BASE_URL}/v3/markets/${market.id}/scooters`, {
      json: true,
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Coup
