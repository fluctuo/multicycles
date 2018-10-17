import test from 'ava'
import nock from 'nock'
import Gbfs from '../lib'

nock('http://exemple.com')
  .get('/station_information.json')
  .times(3)
  .reply(200, {
    last_updated: 1539164337,
    ttl: 10,
    data: {
      stations: [
        {
          station_id: '3',
          name: 'Yas Marina',
          short_name: 'Yas Marina',
          lat: 24.465793,
          lon: 54.60961,
          region_id: 6,
          rental_methods: ['KEY', 'CREDITCARD'],
          capacity: 15
        }
      ]
    }
  })

// test nock

test('overwrite timeout on constructor', async t => {
  const gbfs = new Gbfs({ url: 'http://exemple.com/', timeout: 1 })

  await gbfs
    .stationInfo()
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const gbfs = new Gbfs({ url: 'http://exemple.com/' })

  await gbfs
    .stationInfo({ timeout: 1 })
    .then(e => {
      console.log(e)
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test.only('get bicycles by positions', async t => {
  const gbfs = new Gbfs({ url: 'http://exemple.com/' })

  await gbfs
    .stationInfo()
    .then(result => {
      console.log('result', result)

      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
