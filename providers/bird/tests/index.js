import test from 'ava'
import Bird from '../lib'

let loggedBird

test.before(async t => {
  loggedBird = new Bird()

  await loggedBird.login({
    email: `jaimelesloutres${Math.round(Math.random() * 1000)}@gmail.com`
  })
})

test.after(async t => {
  await loggedBird.logout()
})

test('overwrite timeout on constructor', async t => {
  const bird = new Bird({ timeout: 1 })

  await bird
    .getBicyclesByLatLng({
      lat: 38.907192,
      lng: -77.036871
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
  const bird = new Bird()

  await bird
    .getBicyclesByLatLng(
      {
        lat: 38.907192,
        lng: -77.036871
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
  await loggedBird
    .getBicyclesByLatLng({
      lat: 38.907192,
      lng: -77.036871,
      radius: 1500
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.birds.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
