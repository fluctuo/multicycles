import test from 'ava'
import Donkey from '../lib'

test('overwrite timeout on constructor', async t => {
  const donkey = new Donkey({ timeout: 1 })

  await donkey
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ECONNABORTED')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const donkey = new Donkey()

  await donkey
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
      t.is(err.code, 'ECONNABORTED')
      t.pass()
    })
})

test('get bicycles by positions', async t => {
  const donkey = new Donkey()

  await donkey
    .getBicyclesByLatLng({
      lat: 48.856614,
      lng: 2.352222
    })
    .then(result => {
      t.truthy(result.data.length)
      t.pass()
    })
    .catch(err => {
      console.log(err.response)
      t.fail()
    })
})
