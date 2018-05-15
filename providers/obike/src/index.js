import crypto from 'crypto'
import axios from 'axios'

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
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: timeout,
      headers: {
        version: APP_VERSION,
        platform: 'iOS',
        'Content-Type': 'application/json'
      }
    })
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return this.api.post(
      '/bike/list',
      encodeBody({
        lat,
        lng
      }),
      config
    )
  }
}

export default Obike
