import test from 'ava'
import nock from 'nock'
import Mobike from '../lib'

nock('https://mwx.mobike.com/mobike-api')
  .post('/rent/nearbyBikesInfo.do', {
    latitude: 31.23039,
    longitude: 121.473702
  })
  .reply(200, {
    code: 0,
    message: '',
    biketype: 0,
    autoZoom: true,
    radius: 150,
    object: [
      {
        distId: '0216729683',
        distX: 121.47473058,
        distY: 31.23069014,
        distNum: 1,
        distance: '103',
        bikeIds: '0216729683#',
        biketype: 1,
        type: 0,
        boundary: null
      }
    ]
  })

test('overwrite timeout on constructor', async t => {
  const mobike = new Mobike({ timeout: 1 })

  await mobike
    .getObjects({
      lat: 38.907192,
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
  const mobike = new Mobike()

  await mobike
    .getObjects(
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
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('get objects', async t => {
  const mobike = new Mobike()

  await mobike
    .getObjects({
      lat: 31.23039,
      lng: 121.473702
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.object.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
