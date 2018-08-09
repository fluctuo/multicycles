import test from 'ava'
import Cityscoot from '../lib'

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
