import test from 'ava'
import Nextbike from '../lib'

test('overwrite timeout on constructor', async t => {
  const nextbike = new Nextbike({ timeout: 1 })

  await nextbike
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954
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
  const nextbike = new Nextbike()

  await nextbike
    .getBicyclesByLatLng(
      {
        lat: 52.520007,
        lng: 13.404954
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
  const nextbike = new Nextbike()

  await nextbike
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954
    })
    .then(result => {
      let hasCities = false
      t.is(result.statusCode, 200)
      t.truthy(result.body.countries.length)
      result.body.countries.forEach(country => {
        if (country.cities.length > 0) {
          hasCities = true
        }
      })

      if (!hasCities) {
        t.fail()
      }
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('get bicycles at 0,0', async t => {
  const nextbike = new Nextbike()

  await nextbike
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
