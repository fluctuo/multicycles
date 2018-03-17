import test from 'ava'
import Jump from '../lib'

test('overwrite timeout on constructor', async t => {
  const jump = new Jump({ timeout: 1 })

  await jump
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
  const jump = new Jump()

  await jump
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
  const jump = new Jump()

  await jump
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

test('return error on no available city', async t => {
  const jump = new Jump()

  await jump
    .getBicyclesByLatLng({
      lat: 48.852775,
      lng: 2.369336
    })
    .then(result => {
      t.pass()
    })
    .catch(e => {
      t.fail()
    })
})
