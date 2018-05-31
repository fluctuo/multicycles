import test from 'ava'
import IndigoWheel from '../lib'

test('overwrite timeout on constructor', async t => {
  const indigoWheel = new IndigoWheel({ timeout: 1 })

  await indigoWheel
    .getBicyclesByLatLng({
      lat: 45.764043,
      lng: 4.835659
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
  const indigoWheel = new IndigoWheel()

  await indigoWheel
    .getBicyclesByLatLng(
      {
        lat: 45.764043,
        lng: 4.835659
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
  const indigoWheel = new IndigoWheel()

  await indigoWheel
    .getBicyclesByLatLng({
      lat: 45.764043,
      lng: 4.835659
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
