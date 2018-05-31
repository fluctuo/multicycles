import test from 'ava'
import Obike from '../lib'

test('overwrite timeout on constructor', async t => {
  const obike = new Obike({ timeout: 1 })

  await obike
    .getBicyclesByLatLng({
      lat: 48.852775,
      lng: 2.369336
    })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      console.log(err)
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const obike = new Obike()

  await obike
    .getBicyclesByLatLng(
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

test('get bicycles by positions', async t => {
  const obike = new Obike()

  await obike
    .getBicyclesByLatLng({
      lat: 48.852775,
      lng: 2.369336
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.list.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
