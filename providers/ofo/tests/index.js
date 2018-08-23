import test from 'ava'
import nock from 'nock'
import Ofo from '../lib'

nock('https://one.ofo.com')
  .post('/nearbyofoCar', {
    lat: 48.852775,
    lng: 2.369336,
    token: 'my-token',
    source: 2
  })
  .reply(200, {
    errorCode: 200,
    msg: '附近车辆位置',
    values: {
      cars: [
        {
          carno: '6lOdnQ',
          bomNum: '0',
          userIdLast: '1',
          lng: 2.3522264162607,
          lat: 48.857354974354
        }
      ],
      expPrice: {
        price: '0.50',
        actualPrice: '0.50',
        orderTime: 1200,
        currency: '€',
        type: 1
      },
      icon: 'http://ofo-testmeixi-image.oss-us-west-1.aliyuncs.com//report/6fc78646df3a375416f9c1884728fa50.png',
      bikeIcon: [
        {
          bomNum: '0',
          icon: 'http://ofo-testmeixi-image.oss-us-west-1.aliyuncs.com//report/6fc78646df3a375416f9c1884728fa50.png',
          animationUrl: ''
        }
      ]
    }
  })

test('overwrite timeout on constructor', async t => {
  const ofo = new Ofo({ timeout: 1 })

  await ofo
    .getBicyclesByLatLng({
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
  const ofo = new Ofo({})

  await ofo
    .getBicyclesByLatLng(
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

test('get bicycles by positions', async t => {
  const ofo = new Ofo({ token: 'my-token' })

  await ofo
    .getBicyclesByLatLng({
      lat: 48.852775,
      lng: 2.369336
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.values.cars.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})

test('get bicycles without token', async t => {
  const ofo = new Ofo()

  await ofo
    .getBicyclesByLatLng({
      lat: 48.852775,
      lng: 2.369336
    })
    .then(resp => {
      console.log(resp)
      t.fail()
    })
    .catch(() => {
      t.pass()
    })
})
