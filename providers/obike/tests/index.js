import test from 'ava'
import nock from 'nock'
import Obike from '../lib'

nock('https://mobile.o.bike/api/v2')
  .post('/bike/list', {
    value:
      '1152a752ff6623d245263cc1b500d38306d974dbf57110d8ace721bbaa34511e540976066d0d2d419172a34d7e1283b277d6a17091fd79d38e919ece60608c841378fef75ddf9f434067c768e88983d516a79ef7645c5d0150a3252da11ae30e20a74c8e7243c0fa1f6504536542c43c'
  })
  .times(3)
  .reply(200, {
    data: {
      iconUrl: null,
      list: [
        {
          id: '033004123',
          longitude: 2.371797,
          latitude: 48.853308,
          imei: '3166756E63746937',
          iconUrl: null,
          promotionActivityType: null,
          rideMinutes: null,
          countryId: 55,
          cityId: 250,
          helmet: 0
        }
      ]
    },
    success: true
  })

test('overwrite timeout on constructor', async t => {
  const obike = new Obike({ timeout: 1 })

  await obike
    .getObjects({
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
  const obike = new Obike()

  await obike
    .getObjects(
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

test('get objects', async t => {
  const obike = new Obike()

  await obike
    .getObjects({
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
