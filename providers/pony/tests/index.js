import test from 'ava'
import Cacheman from 'cacheman'
import Pony from '../lib'

const pony = new Pony()

test('get all bicycles', async t => {
  await pony
    .getBicyclesByLatLng()
    .then(result => {
      t.truthy(result.body.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('get bicycles by positions', async t => {
  await pony
    .getBicyclesByLatLng({
      lat: 47.478419, // angers pos
      lng: -0.563166
    })
    .then(result => {
      t.truthy(result.body.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('share the same cache', async t => {
  const cache = new Cacheman()
  const instanceA = new Pony({ datastore: { store: cache } })
  const instanceB = new Pony({ datastore: { store: cache } })

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

  await instanceB
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result.statusCode, 304)
    })
})

test('force bypass cache', async t => {
  const cache = new Cacheman()
  const instanceA = new Pony({ datastore: { store: cache } })
  const instanceB = new Pony({ datastore: { store: cache } })

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

  await instanceB
    .getBicyclesByLatLng(
      {
        lat: 48.856614,
        lng: 2.352222
      },
      { force: true }
    )
    .then(result => {
      t.is(result.statusCode, 200)
    })
})
