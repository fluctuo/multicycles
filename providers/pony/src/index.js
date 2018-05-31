import firebase from 'firebase'
import bboxPolygon from '@turf/bbox-polygon'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'

const DATABASE_URL = 'https://pony-bikes-f8cf9.firebaseio.com'

function boundsFromLatLng(lat, lng) {
  const latMin = lat - 0.045
  const latMax = lat + 0.045
  const lngMin = lng - 0.045 / Math.cos(lat * Math.PI / 180)
  const lngMax = lng + 0.045 / Math.cos(lat * Math.PI / 180)

  return bboxPolygon([latMin, lngMin, latMax, lngMax])
}

class Pony {
  constructor() {
    firebase.initializeApp({
      databaseURL: DATABASE_URL
    })

    this.database = firebase.database()
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    let bounds

    if (lat && lng) {
      bounds = boundsFromLatLng(lat, lng)
    }

    return this.database
      .ref('/rest/bicycles')
      .once('value')
      .then(snapshot => {
        const values = snapshot.val()
        const bikes = Object.keys(values).map(key => values[key])

        return lat && lng
          ? bikes.filter(bike => booleanPointInPolygon(point([bike.latitude, bike.longitude]), bounds))
          : bikes
      })
  }
}

export default Pony
