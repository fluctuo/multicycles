import test from 'ava'
import nock from 'nock'
import Donkey from '../lib'

nock('https://stables.donkey.bike/api')
  .get('/public/availability/hubs')
  .query({
    location: '48.856614,2.352222',
    radius: 1000
  })
  .reply(200, [
    {
      id: 3300,
      name: "11 Place de l'Hôtel de Ville",
      latitude: '48.8573096',
      longitude: '2.3512663',
      radius: 10,
      available_bikes_count: 2,
      thumbnail_url: 'https://donkey-production.s3.amazonaws.com/uploads/hub/image/3300/grey_donkey_thumbnail.jpg',
      country_code: 'FR',
      currency: 'EUR',
      prices: {
        '30': 150,
        '720': 1019,
        '1440': 1200
      }
    }
  ])

test('overwrite timeout on constructor', async t => {
  const donkey = new Donkey({ timeout: 1 })

  await donkey
    .getBicyclesByLatLng({
      lat: 48.9,
      lng: 2.4
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
  const donkey = new Donkey()

  await donkey
    .getBicyclesByLatLng(
      {
        lat: 48.9,
        lng: 2.4
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
  const donkey = new Donkey()

  await donkey
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222,
      radius: 1000
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
