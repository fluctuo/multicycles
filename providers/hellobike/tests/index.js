import test from 'ava'
import nock from 'nock'
import Hellobike from '../lib'

nock('https://api.ttbike.com.cn/api')
  .post('', {
    version: '4.20.0',
    action: 'user.ride.nearBikes',
    lat: 31.23039,
    lng: 121.473702,
    cityCode: 0,
    currentLat: 31.23039,
    currentLng: 121.473702
  })
  .reply(200, {
    code: 0,
    data: [
      {
        bikeNo: '2200000094',
        lat: '45.755686',
        lng: '126.598653',
        price: '1元',
        time: '半小时',
        bikeType: 0
      }
    ]
  })

test('overwrite timeout on constructor', async t => {
  const hellobike = new Hellobike({ timeout: 1 })

  await hellobike
    .getObjects({
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
  const hellobike = new Hellobike()

  await hellobike
    .getObjects(
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

test('get objects', async t => {
  const hellobike = new Hellobike()

  await hellobike
    .getObjects({
      lat: 31.23039,
      lng: 121.473702
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
