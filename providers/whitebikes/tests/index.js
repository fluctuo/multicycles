import test from 'ava'
import WhiteBikes from '../lib'

test('overwrite timeout on constructor', async t => {
  const whiteBikes = new WhiteBikes({ timeout: 1 })

  await whiteBikes
    .getBicyclesByLatLng({
      lat: 48.148596,
      lng: 17.107748
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
  const whiteBikes = new WhiteBikes()

  await whiteBikes
    .getBicyclesByLatLng(
      {
        lat: 48.148596,
        lng: 17.107748
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

test('get all bicycles', async t => {
  const whiteBikes = new WhiteBikes()

  await whiteBikes
    .getBicyclesByLatLng()
    .then(result => {
      t.truthy(result.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('get bicycles by positions', async t => {
  const whiteBikes = new WhiteBikes()

  await whiteBikes
    .getBicyclesByLatLng({
      lat: 48.148596,
      lng: 17.107748
    })
    .then(result => {
      t.truthy(result.length)
      t.pass()
    })
    .catch(err => {
      t.fail()
    })
})
