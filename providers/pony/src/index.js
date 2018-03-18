import crypto from 'crypto'
import querystring from 'querystring'
import firebase from 'firebase'

const DATABASE_URL = 'https://pony-bikes-f8cf9.firebaseio.com'

function boundsFromLatLng(lat, lng) {
  const latMin = lat - 0.045
  const latMax = lat + 0.045
  const lngMin = lng - 0.045 / Math.cos(lat * Math.PI / 180)
  const lngMax = lng + 0.045 / Math.cos(lat * Math.PI / 180)

  return { latMin, lngMin, latMax, lngMax }
}

class Pony {
  constructor() {
    firebase.initializeApp({
      databaseURL: DATABASE_URL
    })

    this.database = firebase.database()
  }

  getBicyclesByLatLng({ lat, lng } = {}, config = {}) {
    // if (!lat || !lng) {
    //   throw new Error('Missing lat/lng')
    // }

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
          ? bikes.filter(
              bike =>
                bike.latitude >= bounds.latMin &&
                bike.latitude <= bounds.latMax &&
                bike.longitude >= bounds.lngMin &&
                bike.longitude <= bounds.lngMax
            )
          : bikes
      })
  }
}

export default Pony
