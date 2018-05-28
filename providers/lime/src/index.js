import axios from 'axios'

const BASE_URL = 'https://web-production.lime.bike/api/rider'

class Lime {
  constructor({ timeout, auth } = {}) {
    this.api = new axios.create({
      baseURL: BASE_URL,
      timeout: timeout
    })

    if (auth) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`
      this.api.defaults.headers.common['Cookie'] = `_limebike-web_session=${auth.session}; path=/; secure; HttpOnly`
    } else {
      // fix https://github.com/axios/axios/issues/812
      this.api.defaults.headers.common['Authorization'] = undefined
      this.api.defaults.headers.common['Cookie'] = undefined
    }
  }

  getOTP({ phone }, config) {
    return this.api.get('/v1/login', {
      data: {
        phone
      },
      ...config
    })
  }

  login({ phone, code }, config = {}) {
    return this.api
      .post(
        '/v1/login',
        {
          login_code: code,
          phone
        },
        config
      )
      .then(resp => {
        this.api.defaults.headers.common['Authorization'] = `Bearer ${resp.data.token}`
        return resp
      })
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return this.api.get('/v1/views/main', {
      params: {
        map_center_latitude: lat,
        map_center_longitude: lng,
        user_latitude: lat,
        user_longitude: lng
      },
      ...config
    })
  }
}

export default Lime
