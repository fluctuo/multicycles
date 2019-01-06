import got from 'got'

const BASE_URL = 'https://web-production.lime.bike/api/rider'

function boundsFromLatLng(lat, lng) {
  const latMin = lat - 0.045
  const latMax = lat + 0.045
  const lngMin = lng - 0.045 / Math.cos((lat * Math.PI) / 180)
  const lngMax = lng + 0.045 / Math.cos((lat * Math.PI) / 180)

  return {
    latMin,
    lngMin,
    latMax,
    lngMax
  }
}

class Lime {
  constructor({ timeout, auth } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }

    if (auth) {
      this.config.headers = {
        Authorization: `Bearer ${auth.token}`,
        Cookie: `_limebike-web_session=${auth.session}; path=/; secure; HttpOnly`
      }
    }
  }

  static getProviderDetails() {
    return {
      name: 'Lime',
      slug: 'lime',
      website: 'https://www.limebike.com/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.limebike',
        ios: 'https://itunes.apple.com/app/id1199780189'
      },
      deepLink: {
        android: 'https://limebike.app.link',
        ios: 'https://limebike.app.link'
      }
    }
  }

  getOTP({ phone }, config) {
    return got.get(`${BASE_URL}/v1/login`, {
      query: {
        phone
      },
      ...config
    })
  }

  login({ phone, code }, config = {}) {
    return got.post(`${BASE_URL}/v1/login`, {
      json: true,
      body: {
        login_code: code,
        phone
      },
      ...config
    })
  }

  getObjects({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    const bounds = boundsFromLatLng(lat, lng)

    return got.get(`${BASE_URL}/v1/views/map`, {
      json: true,
      headers: this.config.headers,
      query: {
        ne_lat: bounds.latMax,
        ne_lng: bounds.lngMax,
        sw_lat: bounds.latMin,
        sw_lng: bounds.lngMin,
        user_latitude: lat,
        user_longitude: lng,
        zoom: 16
      },
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Lime
