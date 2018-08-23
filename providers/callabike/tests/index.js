import test from 'ava'
import nock from 'nock'
import CallABike from '../lib'

test('overwrite timeout on constructor', async t => {
  const callABike = new CallABike({ timeout: 1 })

  await callABike
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
  const callABike = new CallABike()

  await callABike
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
  const callABike = new CallABike()

  nock('https://www.callabike-interaktiv.de')
    .post('/de/rpc', {
      method: 'Map.listBikes',
      params: [
        {
          radius: 1000,
          lat: 52.520007,
          long: 13.404954,
          maxItems: 100
        }
      ]
    })
    .reply(200, {
      error: null,
      result: {
        success: true,
        data: {
          Locations: [
            {
              Description: '10531 Spandauer Straße / Karl-Liebknecht-Straße ',
              Position: {
                Longitude: 13.4053293,
                Latitude: 52.5199911
              },
              Distance: 25.454420719474545,
              isOutside: false,
              FreeBikes: [
                {
                  Number: '14165',
                  canBeRented: true,
                  canBeReturned: false,
                  Version: 5,
                  MarkeID: 3914,
                  MarkeName: 'LIDL-BIKE',
                  isPedelec: false
                }
              ],
              virtStationRadius: 50,
              objectId: 10531,
              objectName: 'Spandauer Straße / Karl-Liebknecht-Straße ',
              isStation: true,
              isPedelec: false,
              totalVehicles: 11,
              markenName: 'LIDL-BIKE',
              city: 'Berlin'
            }
          ]
        }
      }
    })

  await callABike
    .getBicyclesByLatLng({
      lat: 52.520007,
      lng: 13.404954,
      radius: 1000
    })
    .then(result => {
      t.is(result.statusCode, 200)
      t.truthy(result.body.result.data.Locations.length)
      t.pass()
    })
    .catch(err => {
      console.log(err)
      t.fail()
    })
})
