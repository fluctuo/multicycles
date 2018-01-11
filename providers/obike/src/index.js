const firebase = require('firebase')

// https://pony-bikes-f8cf9.firebaseio.com
firebase.initializeApp({
  databaseURL: 'https://turing-emitter-148803.firebaseio.com'
})

var database = firebase.database()

console.log(require('util').inspect(database, { depth: null, colors: true }))

database
  .ref('/bikes')
  .once('value')
  .then(snapshot => {
    console.log(snapshot.val())
  })
  .catch(console.error)

// const BASE_URL = 'http://aws.gobee.bike/GobeeBike/bikes'
// const api = axios.create({
//   baseURL: BASE_URL
// })

// export default {
//   getBicyclesByLatLng({ lat, lng } = {}) {
//     if (!lat || !lng) {
//       throw new Error('Missing lat/lng')
//     }

//     return Promise.resolve([])
//   }
// }
