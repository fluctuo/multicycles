import test from 'ava'
import nock from 'nock'
import Yobike from '../lib'

nock('https://en.api.ohbike.com')
  .post('/v1/vehicle/', /lat=51.456734&lng=-2.591292/gi)
  .reply(200, {
    errcode: 0,
    message: 'ok',
    data: [
      {
        latitude: 51.429616,
        longitude: -2.62513,
        plate_no: '7702465',
        discount: -0.5,
        outside: 1
      }
    ]
  })

test('overwrite timeout on constructor', async t => {
  const yobike = new Yobike({ timeout: 1 })

  await yobike
    .getBicyclesByLatLng({
      lat: 48.852775,
      lng: 2.369336
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
  const yobike = new Yobike()

  await yobike
    .getBicyclesByLatLng(
      {
        lat: 48.852775,
        lng: 2.369336
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
  const yobike = new Yobike()

  await yobike
    .getBicyclesByLatLng({
      lat: 51.456734,
      lng: -2.591292
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
