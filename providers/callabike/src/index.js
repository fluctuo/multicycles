import got from 'got'

const BASE_URL = 'https://www.callabike-interaktiv.de/de/rpc'

class CallABike {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'Call a Bike',
      slug: 'callabike',
      website: 'https://www.callabike-interaktiv.de/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=de.bahn.callabike',
        ios: 'https://itunes.apple.com/app/id420360589'
      },
      deepLink: {
        android: 'callabike://search',
        ios: null
      }
    }
  }

  getObjects({ lat, lng, radius = 400 } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return got.post(`${BASE_URL}`, {
      json: true,
      body: {
        method: 'Map.listBikes',
        params: [
          {
            radius,
            lat,
            long: lng,
            maxItems: 100
          }
        ]
      },
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default CallABike
