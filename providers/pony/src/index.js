import firebase from 'firebase'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'
import Cacheman from 'cacheman'

const DATABASE_URL = 'https://pony-bikes-f8cf9.firebaseio.com'

firebase.initializeApp({
  databaseURL: DATABASE_URL
})

function boundsFromLatLng(lat, lng) {
  const latMin = lat - 0.045
  const latMax = lat + 0.045
  const lngMin = lng - 0.045 / Math.cos(lat * Math.PI / 180)
  const lngMax = lng + 0.045 / Math.cos(lat * Math.PI / 180)

  return bboxPolygon([latMin, lngMin, latMax, lngMax])
}

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

  async getObjects({ lat, lng } = {}, config = {}) {
    let bounds

    if (lat && lng) {
      bounds = boundsFromLatLng(lat, lng)
    }

    const vehicles = await this.datastore.store.get(`pony|vehicles`)

    if (!vehicles || config.force) {
      return this.database
        .ref('/rest/bicycles')
        .once('value')
        .then(async snapshot => {
          const values = snapshot.val()
          const bikes = Object.keys(values).map(key => values[key])

          await this.datastore.store.set(`pony|vehicles`, bikes, this.datastore.ttl.vehicles)

          return {
            statusCode: 200,
            body:
              lat && lng
                ? bikes.filter(bike => booleanPointInPolygon(point([bike.latitude, bike.longitude]), bounds))
                : bikes
          }
        })
    } else {
      return Promise.resolve({
        statusCode: 304,
        body:
          lat && lng
            ? vehicles.filter(bike => booleanPointInPolygon(point([bike.latitude, bike.longitude]), bounds))
            : vehicles
      })
    }
  }
}

export default Pony
