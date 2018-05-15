import test from 'ava'
import Lime from '../lib'

test('overwrite timeout on constructor', async t => {
  const lime = new Lime({ timeout: 1 })

  await lime
    .getBicyclesByLatLng({
      lat: 38.907192, // Washintown, DC
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
  const lime = new Lime()

  await lime
    .getBicyclesByLatLng(
      {
        lat: 38.907192, // Washintown, DC
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
  const lime = new Lime()

  await lime
    .getBicyclesByLatLng({
      lat: 38.907192, // Washintown, DC
      lng: -77.036871
    })
    .then(result => {
      t.truthy(result.data.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('return error on no available city', async t => {
  const lime = new Lime()

  await lime
    .getBicyclesByLatLng({
      lat: 48.852775,
      lng: 2.369336
    })
    .then(result => {
      t.is(result.data.length, 0)
      t.pass()
    })
    .catch(e => {
      t.fail()
    })
})
