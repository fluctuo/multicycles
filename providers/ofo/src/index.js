import axios from 'axios'

const BASE_URL = 'https://one.ofo.com'

class Ofo {
  constructor({ timeout, token } = {}) {
    this.token = token
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: timeout
    })
  }

  getOTP({ tel, ccc }, config) {
    return this.api.post(
      '/verifyCode_v2',
      {
        tel,
        ccc,
        type: 1,
        lat: 48.85,
        lng: 2.37
      },
      config
    )
  }

  login({ tel, code, ccc }, config = {}) {
    return this.api.post(
      '/api/login_v2',
      {
        tel,
        code,
        ccc,
        lat: 48.85,
        lng: 2.37
      },
      config
    )
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return this.api
      .post(
        '/nearbyofoCar',
        {
          lat,
          lng,
          token: this.token,
          source: 2
        },
        config
      )
      .then(result => {
        if (result && result.data && result.data.errorCode !== 200) {
          return Promise.reject(result)
        }

        return result
      })
  }
}

export default Ofo
