import test from 'ava'
import Cacheman from 'cacheman'
import Pony from '../lib'

const pony = new Pony()

test('get objects', async t => {
  await pony
    .getObjects({
      lat: 47.478419, // angers pos
      lng: -0.563166
    })
    .then(result => {
      t.truthy(result[0].body.length)
      t.truthy(result[1].body.length)
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
    .getObjects({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result[0].statusCode, 200)
      t.is(result[1].statusCode, 200)
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })

  await instanceB
    .getObjects({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result[0].statusCode, 304)
      t.is(result[1].statusCode, 304)
    })
})

test('force bypass cache', async t => {
  const cache = new Cacheman()
  const instanceA = new Pony({ datastore: { store: cache } })
  const instanceB = new Pony({ datastore: { store: cache } })

  await instanceA
    .getObjects({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.is(result[0].statusCode, 200)
      t.is(result[1].statusCode, 200)
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })

  await instanceB
    .getObjects(
      {
        lat: 48.856614,
        lng: 2.352222
      },
      { force: true }
    )
    .then(result => {
      t.is(result[0].statusCode, 200)
      t.is(result[1].statusCode, 200)
    })
})
