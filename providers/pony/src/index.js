import firebase from 'firebase'
import Cacheman from 'cacheman'

const DATABASE_URL = 'https://pony-bikes-f8cf9.firebaseio.com'

firebase.initializeApp({
  databaseURL: DATABASE_URL
})

class Pony {
  constructor({ datastore = {} } = {}) {
    this.datastore = {
      store: datastore.store || new Cacheman(),
      ttl: {
        vehicles: (datastore.ttl && datastore.ttl.vehicles) || 2 * 60
      }
    }

    this.database = firebase.database()
  }

  static getProviderDetails() {
    return {
      name: 'Pony',
      slug: 'pony',
      website: 'http://getapony.com/',
      discountCode: null,
      app: {
        android: 'https://play.google.com/store/apps/details?id=co.ponybikes.mercury',
        ios: 'https://itunes.apple.com/app/id1273866794'
      },
      deepLink: {
        android: null,
        ios: null
      }
    }
  }

  async getBikes(config) {
    const vehicles = await this.datastore.store.get(`pony|bikes`)

    if (!vehicles || config.force) {
      return this.database
        .ref('/rest/bicycles')
        .once('value')
        .then(async snapshot => {
          const values = snapshot.val()
          const bikes = Object.keys(values).map(key => values[key])

          await this.datastore.store.set(`pony|bikes`, bikes, this.datastore.ttl.vehicles)

          return {
            statusCode: 200,
            body: bikes
          }
        })
    } else {
      return Promise.resolve({
        statusCode: 304,
        body: vehicles
      })
    }
  }

  async getScooters(config) {
    const vehicles = await this.datastore.store.get(`pony|scooters`)

    if (!vehicles || config.force) {
      return this.database
        .ref('/rest/scooters')
        .once('value')
        .then(async snapshot => {
          const values = snapshot.val()
          const vehicles = Object.keys(values).map(key => values[key])

          await this.datastore.store.set(`pony|scooters`, vehicles, this.datastore.ttl.vehicles)

          return {
            statusCode: 200,
            body: vehicles
          }
        })
    } else {
      return Promise.resolve({
        statusCode: 304,
        body: vehicles
      })
    }
  }

  getObjects({ lat, lng } = {}, config = {}) {
    if (!lat || !lng) {
      throw new Error('Missing lat/lng')
    }

    return Promise.all([this.getBikes(config), this.getScooters(config)])
  }
}

export default Pony
