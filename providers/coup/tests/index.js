import test from 'ava'
import Coup from '../lib'

test('overwrite timeout on constructor', async t => {
  const coup = new Coup({ timeout: 1 })

  await coup
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
  const coup = new Coup()

  await coup
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
  const coup = new Coup()

  await coup
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.scooters.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
