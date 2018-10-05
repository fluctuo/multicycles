import test from 'ava'
import nock from 'nock'
import WhiteBikes from '../lib'

nock('http://whitebikes.info')
  .get('/command.php?action=map:markers')
  .times(4)
  .reply(200, [
    {
      standId: '84',
      bikecount: '0',
      standDescription: 'At Kollarovo square near Radlinskeho; in front of Billa.',
      standName: 'ALZBETKA',
      standPhoto: 'https://whitebikes.info/stands/ALZBETKA.jpg',
      lon: '17.11392200000000000',
      lat: '48.14942400000000000'
    }
  ])

test('overwrite timeout on constructor', async t => {
  const whiteBikes = new WhiteBikes({ timeout: 1 })

  await whiteBikes
    .getObjects({
      lat: 48.148596,
      lng: 17.107748
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
  const whiteBikes = new WhiteBikes()

  await whiteBikes
    .getObjects(
      {
        lat: 48.148596,
        lng: 17.107748
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

test('get all bicycles', async t => {
  const whiteBikes = new WhiteBikes()

  await whiteBikes
    .getObjects()
    .then(result => {
      t.truthy(result.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('get objects', async t => {
  const whiteBikes = new WhiteBikes()

  await whiteBikes
    .getObjects({
      lat: 48.148596,
      lng: 17.107748
    })
    .then(result => {
      t.truthy(result.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
