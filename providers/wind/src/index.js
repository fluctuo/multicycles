import got from 'got'

const BASE_URL = 'https://api-prod.ibyke.io'

class Wind {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'Wind',
      slug: 'wind',
      website: 'https://wind.co/',
      discountCode: 'J41EK4M',
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.zen.zbike',
        ios: 'https://itunes.apple.com/app/id1247826304'
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  getObjects({ lat: latitude, lng: longitude } = {}, config = {}) {
    if (!latitude || !longitude) {
      throw new Error('Missing lat/lng')
    }

    return got.get(`${BASE_URL}/v2/boards`, {
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

export default Wind
