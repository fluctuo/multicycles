import test from 'ava'
import nock from 'nock'
import Spin from '../lib'

nock('https://web.spin.pm/api')
  .post('/v1/auth_tokens', {
    device: {
      mobileType: 'ios',
      uid: /.*/gi
    },
    grantType: 'device'
  })
  .times(4)
  .reply(200, {
    jwt: 'JWT_TOKEN',
    refreshToken: 'JWT_REFRESH_TOKEN',
    existingAccount: false
  })

nock('https://web.spin.pm/api')
  .get('/v3/vehicles')
  .query({
    lat: 47.606209,
    lng: -122.332069,
    distance: 1000
  })
  .times(3)
  .reply(200, {
    vehicles: [{}]
  })

test('login', async t => {
  const spin = new Spin()

  await spin
    .login()
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(spin.token)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

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
  const spin = new Spin()

  await spin
    .getBicyclesByLatLng({
      lat: 47.606209,
      lng: -122.332069,
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
