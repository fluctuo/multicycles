import got from 'got'

const BASE_URL = 'https://stables.donkey.bike/api'

class Donkey {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10),
      headers: {
        Accept: 'application/com.donkeyrepublic.v2'
      }
    }
  }

  static getProviderDetails() {
    return {
      name: 'Donkey Republic',
      slug: 'donkey',
      website: 'https://www.donkey.bike/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.donkeyrepublic.bike.android',
        ios: 'https://itunes.apple.com/app/id933526449'
      },
      deepLink: {
        android: 'https://dnky.bike',
        ios: 'https://dnky.bike'
      }
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
      headers: this.config.headers,
      ...config
    })
  }
}

export default Donkey
