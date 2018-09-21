import test from 'ava'
import nock from 'nock'
import Cacheman from 'cacheman'
import Cityscoot from '../lib'

const citiesMock = nock('https://api-v3.cityscoot.eu/api')
  .get('/v1/city')
  .times(8)
  .reply(200, {
    success: true,
    reason: 1,
    comment: 'No comment specified',
    data: {
      hash: 'e720526787a24028ff408a5cd9ac6ada',
      cities: [
        {
          id: 4,
          name: 'Paris',
          icon: 1,
          position: {
            latitude: 48.856614,
            longitude: 2.352222
          },
          polygon: [[49.04417, 2.65392], [48.65871, 2.65392], [48.65871, 2.01324], [49.04417, 2.01324]]
        }
      ]
    }
  })

const vehiclesMock = nock('https://e192rk8dx7.execute-api.eu-west-2.amazonaws.com')
  .get('/dev/api/scooters/public/city/4')
  .times(7)
  .reply(200, {
    success: true,
    reason: 1,
    comment: 'Scooter list',
    data: {
      scooters: [
        {
          id: 884,
          name: 'scoot 684',
          geohash: 'u09wj9esh',
          geocoding: '79 Boulevard de Magenta, 75010 Paris, France',
          battery: 40,
          autonomy: 40,
          plate: 'EJ 573 SL',
          latitude: 48.87613833333334,
          longitude: 2.356093333333333,
          id_availability: 1,
          number: 684
        }
      ]
    }
  })

test.after(t => {
  t.true(citiesMock.isDone())
  t.true(vehiclesMock.isDone())
})

test('Get cities', async t => {
  const cityscoot = new Cityscoot()

  await cityscoot.getCities()
  const cities = await cityscoot.datastore.store.get('cityscoot|cities')

  t.truthy(cities.length)
})

test('overwrite timeout on constructor', async t => {
  const cityscoot = new Cityscoot({ timeout: 1 })

  await cityscoot
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
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
  const cityscoot = new Cityscoot()

  await cityscoot
    .getBicyclesByLatLng(
      {
        lat: 48.856614,
        lng: 2.352222
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
  const cityscoot = new Cityscoot()

  await cityscoot
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.scooters.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('Get vehicle from cache', async t => {
  const cityscoot = new Cityscoot()

  await cityscoot
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.scooters.length)

      return cityscoot
        .getBicyclesByLatLng({
          lat: 48.856614,
          lng: 2.352222
        })
        .then(result => {
          t.is(result.statusCode, 304)
          t.truthy(result.body.data.scooters.length)
          t.pass()
        })
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('Force bypass cache', async t => {
  const cityscoot = new Cityscoot()

  await cityscoot
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result.statusCode, 200)

      return cityscoot
        .getBicyclesByLatLng(
          {
            lat: 48.856614,
            lng: 2.352222
          },
          { force: true }
        )
        .then(result => {
          t.is(result.statusCode, 200)

          t.pass()
        })
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('share the same cache', async t => {
  const cache = new Cacheman()
  const instanceA = new Cityscoot({ datastore: { store: cache } })
  const instanceB = new Cityscoot({ datastore: { store: cache } })

  await instanceA
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result.statusCode, 200)
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })

  const cities = await instanceB.getCities()
  t.truthy(cities.length)
})

test('return not covered at 0,0', async t => {
  const cityscoot = new Cityscoot()

  await cityscoot
    .getBicyclesByLatLng({
      lat: 0.1,
      lng: 0.1
    })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.toString(), 'Error: Not Covered')
      t.pass()
    })
})
