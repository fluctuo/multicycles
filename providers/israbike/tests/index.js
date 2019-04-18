import test from 'ava'
import nock from 'nock'
import Israbike from '../lib'

nock('https://en.api.ohbike.com')
  .post('/v1/vehicle/', /lat=32.07009&lng=34.7688329/gi)
  .reply(200, {
    errcode: 0,
    message: 'ok',
    data: [
      {
        latitude: 32.07009,
        longitude: 34.7688329,
        plate_no: '7702465',
        discount: 1,
        outside: 1
      }
    ]
  })

nock('https://en.api.ohbike.com')
  .post('/v1/scooter/', /lat=32.07009&lng=34.7688329/gi)
  .reply(200, {
    errcode: 0,
    message: 'ok',
    data: [
      {
        latitude: 32.07009,
        longitude: 34.7688329,
        plate_no: '7702465',
        discount: 1,
        outside: 1
      }
    ]
  })

test('overwrite timeout on constructor', async t => {
  const israbike = new Israbike({ timeout: 1 })

  await israbike
    .getObjects({
      lat: 32.07009,
      lng: 34.7688329
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
  const israbike = new Israbike()

  await israbike
    .getObjects(
      {
        lat: 32.07009,
        lng: 34.7688329
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

test('get objects', async t => {
  const israbike = new Israbike({ timeout: 10000 })

  await israbike
    .getObjects({
      lat: 32.07009,
      lng: 34.7688329
    })
    .then(result => {
      t.is(result.length, 2)
      t.truthy(result[0].body.data.length)
      t.truthy(result[1].body.data.length >= 0)
      t.pass()
    })
    .catch(err => {
      console.log(err.code)
      console.log(err)
      t.fail()
    })
})
