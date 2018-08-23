import got from 'got'
import uuid from 'uuid/v1'
import jwt from 'jsonwebtoken'

const BASE_URL = 'https://web.spin.pm/api'

class Spin {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: 'Spin',
      slug: 'spin',
      website: 'https://www.spin.pm',
      discount: 'MULOTMAI',
      app: {
        android: 'https://play.google.com/store/apps/details?id=pm.spin',
        ios: 'https://itunes.apple.com/app/id1241808993'
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  login({ uid = uuid() } = {}) {
    return got
      .post(`${BASE_URL}/v1/auth_tokens`, {
        json: true,
        body: {
          device: {
            uid,
            mobileType: 'ios'
          },
          grantType: 'device'
        }
      })
      .then(result => {
        if (result.body && result.body.jwt) {
          this.decodedToken = jwt.decode(result.body.jwt)
          this.token = result.body.jwt
          this.refreshToken = result.body.refreshToken
        }

        return result
      })
  }

  refresh() {
    return got
      .post(`${BASE_URL}/v1/auth_tokens`, {
        json: true,
        body: {
          grantType: 'refresh_token',
          userUniqueKey: this.decodedToken.userUniqueKey,
          refreshToken: this.refreshToken
        }
      })
      .then(result => {
        if (result.body && result.body.jwt) {
          this.decodedToken = jwt.decode(result.body.jwt)
          this.token = result.body.jwt
          this.refreshToken = result.body.refreshToken
        }

        return result
      })
  }

  loginOrRefresh() {
    if (!this.token) {
      return this.login()
    } else if (this.decodedToken.exp < Math.floor(Date.now() / 1000)) {
      return this.refresh()
    } else {
      return Promise.resolve()
    }
  }

  async getBicyclesByLatLng({ lat, lng, distance = 500 } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    await this.loginOrRefresh()

    return got.get(`${BASE_URL}/v3/vehicles`, {
      json: true,
      query: {
        lat,
        lng,
        distance
      },
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      ...config
    })
  }
}

export default Spin
