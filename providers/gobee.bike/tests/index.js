import test from 'ava'
import GobeeBike from '../lib'

test('overwrite timeout on constructor', async t => {
  const gobee = new GobeeBike({ timeout: 1 })

  await gobee
    .getBicyclesByLatLng({
      lat: 48.852775,
      lng: 2.369336
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
  const gobee = new GobeeBike()

  await gobee
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
  const gobee = new GobeeBike()

  await gobee
    .getBicyclesByLatLng({
      lat: 22.359,
      lng: 114.121
    })
    .then(result => {
      t.is(result.statusCode, 200)
      // t.truthy(result.body.data.bikes.length)
      t.pass()
    })
    .catch(() => {
      console.log(err)
      t.fail()
    })
})
