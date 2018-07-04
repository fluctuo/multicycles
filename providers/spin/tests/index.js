import test from 'ava'
import Spin from '../lib'

test('overwrite timeout on constructor', async t => {
  const spin = new Spin({ timeout: 1 })

  await spin
    .getBicyclesByLatLng({
      lat: 34.052234,
      lng: -118.243685
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
  const spin = new Spin()

  await spin
    .getBicyclesByLatLng(
      {
        lat: 34.052234,
        lng: -118.243685
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
  const spin = new Spin({ email: 'titi@mail.com', password: '123456' })

  await spin
    .getBicyclesByLatLng({
      lat: 38.907192,
      lng: -77.036871,
      distance: 1000
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.vehicles.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
