import test from 'ava'
import nock from 'nock'
import Byke from '../lib'

nock('https://api-prod.ibyke.io')
  .get('/v2/bikes')
  .query({
    latitude: 52.520007,
    longitude: 13.404954
  })
  .times(3)
  .reply(200, {
    result: 0,
    items: [
      {
        bikeId: 'bee005d0-df80-11e7-8082-5ffd484110e1',
        bikeType: 'Type fenghuang',
        bikeNo: '037689',
        lockType: 'luoping',
        pricingUnit: 0,
        pricingAmount: 0,
        latitude: '52.5291348',
        longitude: '13.4015775',
        currentRideId: null,
        vol: '413',
        status: 2,
        isLocked: 1,
        isReadyForRiding: 1,
        addressJson: {
          address_components: [
            {
              long_name: '2',
              short_name: '2',
              types: ['street_number']
            },
            {
              long_name: 'Rosenthaler Straße',
              short_name: 'Rosenthaler Str.',
              types: ['route']
            },
            {
              long_name: 'Mitte',
              short_name: 'Mitte',
              types: ['political', 'sublocality', 'sublocality_level_1']
            },
            {
              long_name: 'Berlin',
              short_name: 'Berlin',
              types: ['locality', 'political']
            },
            {
              long_name: 'Berlin',
              short_name: 'Berlin',
              types: ['administrative_area_level_1', 'political']
            },
            {
              long_name: 'Deutschland',
              short_name: 'DE',
              types: ['country', 'political']
            },
            {
              long_name: '10119',
              short_name: '10119',
              types: ['postal_code']
            }
          ],
          formatted_address: 'Rosenthaler Str. 2, 10119 Berlin, Deutschland',
          geometry: {
            bounds: {
              northeast: {
                lat: 52.52959749999999,
                lng: 13.4018509
              },
              southwest: {
                lat: 52.52896330000001,
                lng: 13.4013262
              }
            },
            location: {
              lat: 52.5291604,
              lng: 13.4016654
            },
            location_type: 'RANGE_INTERPOLATED',
            viewport: {
              northeast: {
                lat: 52.5306293802915,
                lng: 13.4029375302915
              },
              southwest: {
                lat: 52.5279314197085,
                lng: 13.4002395697085
              }
            }
          },
          place_id: 'Ei1Sb3NlbnRoYWxlciBTdHIuIDIsIDEwMTE5IEJlcmxpbiwgRGV1dHNjaGxhbmQ',
          types: ['street_address']
        },
        lockInfoLuoping: {
          isLocked: 1,
          lockNo: 'LkHBlC-I7',
          mac: '9070650BE23B',
          version: '1288'
        }
      }
    ]
  })

test('overwrite timeout on constructor', async t => {
  const byke = new Byke({ timeout: 1 })

  await byke
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
  const byke = new Byke()

  await byke
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
  const byke = new Byke()

  await byke
    .getObjects({
      lat: 52.520007,
      lng: 13.404954
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
