import test from 'ava'
import nock from 'nock'
import Wind from '../lib'

nock('https://api-prod.ibyke.io')
  .get('/v2/boards')
  .query({
    latitude: 48.856613,
    longitude: 2.352222
  })
  .times(3)
  .reply(200, {
    result: 0,
    items: [
      {
        boardId: '380d0ce7-c703-4e42-98d1-bedde123610a',
        boardType: 'ninebot',
        boardNo: 'S0000097',
        lockType: 'moby',
        lockNo: 'S0000097',
        latitude: '48.857226',
        longitude: '2.351636',
        currentRideId: null,
        vol: '57',
        status: 2,
        isLocked: 1,
        isReadyForRiding: 1,
        lockInfo: {
          mac: 'D903D9BE17C6'
        },
        isInOperatingHours: 1,
        operatingHours: {
          from: '07:00',
          to: '21:00'
        },
        isMobileOnline: 1,
        activeTime: '2018-09-09T16:44:53.000Z',
        connectedTime: null,
        lastOpenTime: '2018-08-29T14:03:24.000Z',
        lastPingTime: '2018-09-09T16:44:53.000Z',
        openRequestTime: null
      }
    ]
  })

test('overwrite timeout on constructor', async t => {
  const wind = new Wind({ timeout: 1 })

  await wind
    .getObjects({
      lat: 48.856613,
      lng: 2.352222
    })
    .then(r => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const wind = new Wind()

  await wind
    .getObjects(
      {
        lat: 48.856613,
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

test('get objects', async t => {
  const wind = new Wind()

  await wind
    .getObjects({
      lat: 48.856613,
      lng: 2.352222
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.items.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
