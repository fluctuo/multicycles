import got from 'got'

const BASE_URL = 'https://appaws.gobee.bike/GobeeBike/bikes'

class GobeeBike {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'GoBee Bike',
      slug: 'gobeebike',
      website: 'http://gobee.bike/',
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.pgt.gobeebike',
        ios: 'https://itunes.apple.com/app/id1230842750'
      }
    }
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return got.get(`${BASE_URL}/near_bikes`, {
      json: true,
      query: {
        lat,
        lng
      },
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default GobeeBike
