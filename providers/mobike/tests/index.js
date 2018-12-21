import test from 'ava'
import nock from 'nock'
import Mobike from '../lib'

nock('https://app.mobike.com/api')
  .post('/nearby/v4/nearbyBikeInfo', {
    latitude: 31.23039,
    longitude: 121.473702
  })
  .reply(200, {
    code: 0,
    message: '',
    bike: [
      {
        distId: 'A766045548',
        distX: 2.353139,
        distY: 48.856437,
        distNum: 1,
        distance: '69',
        bikeIds: 'A766045548#',
        biketype: 2,
        type: 0,
        boundary: null,
        operateType: 2
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
      t.truthy(result.body.bike.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
