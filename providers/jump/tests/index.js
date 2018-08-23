import test from 'ava'
import nock from 'nock'
import Jump from '../lib'

nock('https://dc.jumpmobility.com/opendata')
  .get('/free_bike_status.json')
  .times(3)
  .reply(200, {
    last_updated: 1535019173,
    ttl: 180,
    data: {
      bikes: [
        {
          bike_id: 'bike_16488',
          name: 'JUMP DC-0214',
          lon: -76.96841166666667,
          lat: 38.92384333333333,
          is_reserved: 0,
          is_disabled: 0,
          jump_ebike_battery_level: '91%'
        }
      ]
    }
  })

test('overwrite timeout on constructor', async t => {
  const jump = new Jump({ timeout: 1 })

  await jump
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
  const jump = new Jump()

  await jump
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
  const jump = new Jump()

  await jump
    .getBicyclesByLatLng({
      lat: 38.907192,
      lng: -77.036871
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.data.bikes.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('return error on no available city', async t => {
  const jump = new Jump()

  await jump
    .getBicyclesByLatLng({
      lat: 48.852775,
      lng: 2.369336
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.is(result.body.data.bikes.length, 0)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
