import got from 'got'

const BASE_URL = 'https://one.ofo.com'

class Ofo {
  constructor({ timeout, token } = {}) {
    this.token = token
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'Ofo',
      slug: 'ofo',
      website: 'https://www.ofo.com',
      app: {
        android: 'https://play.google.com/store/apps/details?id=so.ofo.abroad',
        ios: 'https://itunes.apple.com/us/app/ofo-smart-bike-sharing/id1190831637?mt=8'
      }
    }
  }

  getOTP({ tel, ccc }, config) {
    return got.post(`${BASE_URL}/verifyCode_v2`, {
      json: true,
      body: {
        tel,
        ccc,
        type: 1,
        lat: 48.85,
        lng: 2.37
      },
      ...config
    })
  }

  login({ tel, code, ccc }, config = {}) {
    return got.post(`${BASE_URL}/api/login_v2`, {
      json: true,
      body: {
        tel,
        code,
        ccc,
        lat: 48.85,
        lng: 2.37
      },
      ...config
    })
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return got
      .post(`${BASE_URL}/nearbyofoCar`, {
        json: true,
        body: {
          lat,
          lng,
          token: this.token,
          source: 2
        },
        timeout: this.config.timeout,
        ...config
      })
      .then(result => {
        if (result && result.body && result.body.errorCode !== 200) {
          return Promise.reject(result)
        }

        return result
      })
  }
}

export default Ofo
