import got from 'got'
import uuid from 'uuid/v1'

const BASE_URL = 'https://api.bird.co'
const APP_VERSION = '3.0.5'
const DEVICE_ID = uuid()
const PLATFORM = 'ios'

class Bird {
  constructor({ token, timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10),
      headers: {
        'Content-Type': 'application/json',
        'App-Version': APP_VERSION,
        'Device-id': DEVICE_ID,
        Platform: PLATFORM
      }
    }

    if (token) {
      this.config.headers['Authorization'] = `Bird ${token}`
    }
  }

  static getProviderDetails() {
    return {
      name: 'Bird',
      slug: 'bird',
      website: 'https://www.bird.co/',
      discountCode: 'https://gift.bird.co/4uR8WFEeuO',
      app: {
        android: 'https://play.google.com/store/apps/details?id=co.bird.android',
        ios: 'https://itunes.apple.com/app/id1260842311'
      },
      deepLink: {
        android: 'https://98kz.app.link',
        ios: 'https://98kz.app.link'
      }
    }
  }

  login({ email }, config = {}) {
    if (!email) {
      throw new Error('Email is required')
    }

    return got
      .post(`${BASE_URL}/user/login`, {
        json: true,
        body: JSON.stringify({
          email: email
        }),
        timeout: this.config.timeout,
        headers: this.config.headers,
        ...config
      })
      .then(result => {
        if (result.body && result.body.token) {
          this.config.headers['Authorization'] = `Bird ${result.body.token}`
        }

        return result
      })
  }

  confirmOTP({ otp: token }, config = {}) {
    return got.put(`${BASE_URL}/request/accept`, {
      json: true,
      body: JSON.stringify({
        token
      }),
      timeout: this.config.timeout,
      headers: this.config.headers,
      ...config
    })
  }

  logout() {
    return got
      .post(`${BASE_URL}/user/logout`, {
        headers: this.config.headers
      })
      .then(result => {
        delete this.config.headers['Authorization']
        return result
      })
  }

  getObjects({ lat: latitude, lng: longitude, radius = 500 } = {}, config = {}) {
    if (!latitude || !longitude) {
      throw new Error('Missing lat/lng')
    }

    return got.get(`${BASE_URL}/bird/nearby`, {
      json: true,
      query: {
        latitude,
        longitude,
        radius
      },
      timeout: this.config.timeout,
      headers: {
        ...this.config.headers,
        Location: JSON.stringify({
          latitude,
          longitude
        })
      },
      ...config
    })
  }

  getUser(config = {}) {
    return got.get(`${BASE_URL}/user`, {
      json: true,
      timeout: this.config.timeout,
      headers: this.config.headers,
      ...config
    })
  }

  getCreditCards(config = {}) {
    return got.get(`${BASE_URL}/stripe/cards`, {
      json: true,
      timeout: this.config.timeout,
      headers: this.config.headers,
      ...config
    })
  }
}

export default Bird
