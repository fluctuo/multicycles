import querystring from 'querystring'
import got from 'got'

const BASE_URL = 'https://app.mobike.com/api'

class Mobike {
  constructor({ timeout } = {}) {
    this.config = {
      timeout: timeout && parseInt(timeout, 10),
      headers: {
        version: '8.7.1',
        platform: '1',
        'User-Agent':
          'Mozilla/5.0 (Android 7.1.2; Pixel Build/NHG47Q) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.9 NTENTBrowser/3.7.0.496 (IWireless-US) Mobile Safari/537.36'
      }
    }
  }

  static getProviderDetails() {
    return {
      name: 'Mobike',
      slug: 'mobike',
      website: 'https://mobike.com/',
      discountCode:
        'https://m2.mobike.com/h5/overseas_accept_invite/en/index.html?referralId=V1U0Rjl2VmdVVWdobThUUjVPcUlNRVROdlpyZFFKY2ZlZzc0ZlkyN0NIbz0=&nickName=&reward=50',
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.mobike.mobikeapp',
        ios: 'https://itunes.apple.com/app/id1044535426'
      },
      deepLink: {
        android: null,
        ios: 'growing.98cfc9b5ea1caa2c://'
      }
    }
  }

  getObjects({ lat: latitude, lng: longitude } = {}, config = {}) {
    if (!latitude || !longitude) {
      throw new Error('Missing lat/lng')
    }

    return got.post(`${BASE_URL}/nearby/v4/nearbyBikeInfo`, {
      json: true,
      form: true,
      body: {
        latitude,
        longitude
      },
      timeout: this.config.timeout,
      headers: this.config.headers,
      ...config
    })
  }
}

export default Mobike
