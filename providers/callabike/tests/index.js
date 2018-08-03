import test from 'ava'
import CallABike from '../lib'

test('overwrite timeout on constructor', async t => {
  const callABike = new CallABike({ timeout: 1 })

  await callABike
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954
    })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const callABike = new CallABike()

  await callABike
    .getBicyclesByLatLng(
      {
        lat: 52.520007,
        lng: 13.404954
      },
      { timeout: 1 }
    )
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('get bicycles by positions', async t => {
  const callABike = new CallABike()

  await callABike
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.result.data.Locations.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
