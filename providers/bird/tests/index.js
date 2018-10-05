import test from 'ava'
import nock from 'nock'
import Bird from '../lib'

let bird = new Bird()

test('login', async t => {
  nock('https://api.bird.co')
    .post('/user/login', {
      email: 'jaimelesloutres@gmail.com'
    })
    .reply(200, {
      id: '8d78b6e3-e9f6-45c6-b050-39f8e7dbcd7c',
      token: 'tokentoken'
    })

  await bird.login({ email: 'jaimelesloutres@gmail.com' }).then(result => {
    t.is(result.statusCode, 200)
    t.is(bird.config.headers['Authorization'], 'Bird tokentoken')
    t.pass()
  })
})

test('logout', async t => {
  const newBird = new Bird()
  newBird.config.headers['Authorization'] = 'Bird tokentoken'

  nock('https://api.bird.co')
    .post('/user/logout')
    .reply(200, 'true')

  await newBird.logout().then(result => {
    t.is(result.statusCode, 200)
    t.falsy(newBird.config.headers['Authorization'])
    t.pass()
  })
})

test('overwrite timeout on constructor', async t => {
  const bird = new Bird({ timeout: 1 })

  await bird
    .getObjects({
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
    .getObjects(
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

test('get objects', async t => {
  nock('https://api.bird.co')
    .get('/bird/nearby')
    .query({
      latitude: 38.907192,
      longitude: -77.036871,
      radius: 1500
    })
    .reply(200, {
      birds: [
        {
          location: {
            latitude: 48.857246,
            longitude: 2.350357
          },
          id: '40eed490-9814-46b9-9d7c-4bbba5143192',
          code: 'TPXVE',
          battery_level: 86
        }
      ]
    })

  await bird
    .getObjects({
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
