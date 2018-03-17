import test from 'ava'
import Mobike from '../lib'

test('overwrite timeout on constructor', async t => {
  const mobike = new Mobike({ timeout: 1 })

  await mobike
    .getBicyclesByLatLng({
      lat: 38.907192,
      lng: -77.036871
    })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ECONNABORTED')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const mobike = new Mobike()

  await mobike
    .getBicyclesByLatLng(
      {
        lat: 38.907192,
        lng: -77.036871
      },
      { timeout: 1 }
    )
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ECONNABORTED')
      t.pass()
    })
})

test('get bicycles by positions', async t => {
  const mobike = new Mobike()

  await mobike
    .getBicyclesByLatLng({
      lat: 38.907192,
      lng: -77.036871
    })
    .then(result => {
      t.is(result.status, 200)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})
