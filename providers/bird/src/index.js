import got from 'got'
import uuid from 'uuid/v1'

const BASE_URL = 'https://api.bird.co'
const APP_VERSION = '3.0.5'

class Bird {
  constructor({ token, timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10),
      headers: {
        'App-Version': APP_VERSION
      }
    }

    if (token) {
      this.config.headers['Authorization'] = `Bird ${token}`
    }
  }

  static getProviderDetails() {
    return {
      name: 'bird',
      website: 'https://www.bird.co/',
      app: {
        android: 'https://play.google.com/store/apps/details?id=co.bird.android',
        ios: 'https://itunes.apple.com/us/app/bird-enjoy-the-ride/id1260842311'
      }
    }
  }

  login({ email, deviceId = uuid(), platform = 'ios' }, config = {}) {
    if (!email) {
      throw new Error('Email is required')
    }

    return got
      .post(`${BASE_URL}/user/login`, {
        json: true,
        body: {
          email
        },
        timeout: this.config.timeout,
        headers: {
          ...this.config.headers,
          'Device-id': deviceId,
          Platform: platform
        },
        ...config
      })
      .then(result => {
        if (result.body && result.body.token) {
          this.config.headers['Authorization'] = `Bird ${result.body.token}`
        }

        return result
      })
  }

  logout() {
    return got.post(`${BASE_URL}/user/logout`, {
      headers: {
        ...this.config.headers
      }
    })
  }

  getBicyclesByLatLng({ lat: latitude, lng: longitude, radius = 500 } = {}, config = {}) {
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
}

export default Bird
