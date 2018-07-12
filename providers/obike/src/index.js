import crypto from 'crypto'
import got from 'got'

const BASE_URL = 'https://mobile.o.bike/api/v2'

const APP_VERSION = '3.2.4'
const SHA1KEY = 'oBiOSX4buhBMG'

function sha1(input) {
  return crypto
    .createHash('sha1')
    .update(input)
    .digest('hex')
}

function encodeBody({ lat, lng }) {
  const data = {
    countryCode: '33',
    longitude: lng,
    latitude: lat
  }

  const versionWithoutDots = APP_VERSION.replace(/\./g, '')

  let jsonData = JSON.stringify(data).replace(/\s/g, '')
  let sha1Data = jsonData + '&' + SHA1KEY + versionWithoutDots
  let cryptData = jsonData + '&' + sha1(sha1Data)

  const KEY = 'oBiOSMYFUzLed' + versionWithoutDots
  const IV = '1234567890123456'

  let cipher = crypto.createCipheriv('aes128', KEY, IV)
  let encrypted = cipher.update(cryptData, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return { value: encrypted }
}

class Obike {
  constructor({ timeout } = {}) {
    this.config = {
      baseURL: BASE_URL,
      timeout: timeout && parseInt(timeout, 10),
      headers: {
        version: APP_VERSION,
        platform: 'iOS',
        'Content-Type': 'application/json'
      }
    }
  }

  static getProviderDetails() {
    return {
      name: 'Obike',
      slug: 'obike',
      website: 'https://www.o.bike',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.obike',
        ios: 'https://itunes.apple.com/app/obike/id1184154041'
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return got.post(`${this.config.baseURL}/bike/list`, {
      json: true,
      headers: this.config.headers,
      body: encodeBody({
        lat,
        lng
      }),
      timeout: this.config.timeout,
      ...config
    })
  }
}

export default Obike
