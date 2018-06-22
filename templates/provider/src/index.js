import got from 'got'

const BASE_URL = '@TODO BASE_URL'

class {{ properCase provider }} {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: '{{ provider }}',
      slug: '{{ totalyLower provider }}',
      website: '@TODO website',
      app: {
        android: '@TODO android link',
        ios: '@TODO ios link'
      }
    }
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    // @TODO custom getBicyclesByLatLng
    return got.get(`${BASE_URL}`, {
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

export default {{ properCase provider }}
