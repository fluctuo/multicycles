import test from 'ava'
import nock from 'nock'
import SharingOS from '../lib'

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

nock('https://en.api.ohbike.com')
  .post('/v1/scooter/', /lat=51.456734&lng=-2.591292/gi, {
    lat: 51.456734,
    lng: -2.591292,
    distance: 700,
    coord_type: 1,
    t: 'geonear',
    ts: 1546099936.075,
    ak: 'abcd',
    bounds: '51.411733999999996,-2.6635109176971685;51.501734,-2.519073082302832',
    zoom: '11.000000',
    sign: '761a616db0318ea4ec1b7ef59b730856'
  })
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

test.serial('init SharingOS without appkey', t => {
  const error = t.throws(() => {
    new SharingOS({ timeout: 1 })
  }, Error)
  t.is(error.message, 'Missing appKey')
})

test.serial('overwrite timeout on constructor', async t => {
  const sharingos = new SharingOS({ timeout: 1, appKey: 'abcd' })

  await sharingos
    .getVehicules({
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

test.serial('overwrite timeout on method', async t => {
  const sharingos = new SharingOS({ appKey: 'abcd' })

  await sharingos
    .getVehicules(
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

test.serial('get vehicules', async t => {
  const sharingos = new SharingOS({ appKey: 'abcd' })

  await sharingos
    .getVehicules({
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

test.serial('get scooters', async t => {
  const sharingos = new SharingOS({ appKey: 'abcd' })

  await sharingos
    .getScooters({
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

test.serial('is nock is done', t => {
  console.log()
  t.true(nock.isDone())
})
