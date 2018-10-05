import got from 'got'

const BASE_URL = 'https://api.ttbike.com.cn/api'
const APP_VERSION = '4.20.0'

class Hellobike {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'Hellobike',
      slug: 'hellobike',
      website: 'http://www.hellobike.com/',
      discountCode: null,
      app: {
        android: null,
        ios: null
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  getObjects({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return got.post(`${BASE_URL}`, {
      json: true,
      body: {
        version: APP_VERSION,
        action: 'user.ride.nearBikes',
        cityCode: 0,
        lat: lat,
        lng: lng,
        currentLat: lat,
        currentLng: lng
      },
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Hellobike
