import got from 'got'
import Cacheman from 'cacheman'
const BASE_URL = 'https://api.moovin.paris'

class Moovin {
  constructor({ timeout, datastore = {} } = {}) {
    this.datastore = {
      store: datastore.store || new Cacheman(),
      ttl: {
        vehicles: (datastore.ttl && datastore.ttl.vehicles) || 2 * 60
      }
    }

    this.config = {
      timeout: timeout && parseInt(timeout, 10)
    }
  }

  static getProviderDetails() {
    return {
      name: "Moov'in.paris",
      slug: 'moovin',
      website: 'https://www.moovin.paris/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=com.ada.moovinparis.prod',
        ios: 'https://itunes.apple.com/app/moovin-paris/id1435462279'
      },
      deepLink: {
        android: 'moovinparis://',
        ios: null
      }
    }
  }

  async getObjects({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    const data = await this.datastore.store.get(`moovin|vehicles`)

    if (!data || config.force) {
      return got
        .get(`${BASE_URL}/agencies/freeFloating/Vehicles/available`, {
          json: true,
          timeout: this.config.timeout,
          ...config
        })
        .then(async result => {
          await this.datastore.store.set('moovin|vehicles', result.body, this.datastore.ttl.vehicles)
          return result
        })
    } else {
      return Promise.resolve({
        statusCode: 304,
        body: data
      })
    }
  }
}

export default Moovin
