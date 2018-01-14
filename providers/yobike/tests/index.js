import test from 'ava'
import yobike from '../lib'

test('get bicycles by positions', async t => {
  await yobike
    .getBicyclesByLatLng({
      lat: 51.456734,
      lng: -2.591292
    })
    .then(result => {
      t.truthy(result.data.data.length)
      t.pass()
    })
    .catch(err => {
      console.log(err.response)
      t.fail()
    })
})
