import got from 'got'

const BASE_URL = 'https://web-production.lime.bike/api/rider'

class Lime {
  constructor({ timeout, auth } = {}) {
    this.config = {
      timeout: timeout
    }

    if (auth) {
      this.config.headers = {
        Authorization: `Bearer ${auth.token}`,
        Cookie: `_limebike-web_session=${auth.session}; path=/; secure; HttpOnly`
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

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return got.get(`${BASE_URL}/v1/views/main`, {
      json: true,
      headers: this.config.headers,
      query: {
        map_center_latitude: lat,
        map_center_longitude: lng,
        user_latitude: lat,
        user_longitude: lng
      },
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Lime
