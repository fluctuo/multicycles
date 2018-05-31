import test from 'ava'
import Lime from '../lib'

test('overwrite timeout on constructor', async t => {
  const lime = new Lime({
    auth: {
      token: process.env.LIME_AUTH_TOKEN,
      session: process.env.LIME_AUTH_SESSION
    },
    timeout: 1
  })

  await lime
    .getBicyclesByLatLng({
      lat: 38.907192, // Washintown, DC
      lng: -77.036871
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
  const lime = new Lime({
    auth: {
      token: process.env.LIME_AUTH_TOKEN,
      session: process.env.LIME_AUTH_SESSION
    }
  })

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
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('get bicycles by positions', async t => {
  const lime = new Lime({
    auth: {
      token: process.env.LIME_AUTH_TOKEN,
      session: process.env.LIME_AUTH_SESSION
    }
  })

  await lime
    .getBicyclesByLatLng({
      lat: 38.907192, // Washintown, DC
      lng: -77.036871
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.attributes.nearby_locked_bikes.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('get bicycles without auth', async t => {
  const lime = new Lime()

  await lime
    .getBicyclesByLatLng({
      lat: 38.907192, // Washintown, DC
      lng: -77.036871
    })
    .then(result => {
      console.log(result)
      t.fail()
    })
    .catch(err => {
      t.pass()
    })
})
