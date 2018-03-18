import test from 'ava'
import Pony from '../lib'

const pony = new Pony()

test('get all bicycles', async t => {
  await pony
    .getBicyclesByLatLng()
    .then(result => {
      t.truthy(result.length)
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
      t.truthy(result.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
