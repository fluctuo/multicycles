import test from 'ava'
import nock from 'nock'
import Fleetbird from '../lib'

nock('https://localhost')
  .get('/cars')
  .times(3)
  .reply(200, [
    {
      carId: 10011,
      title: '',
      lat: 48.19866,
      lon: 16.377358,
      licencePlate: '10011',
      fuelLevel: 94,
      vehicleStateId: 0,
      vehicleTypeId: 6,
      pricingTime: '0.15€/min',
      pricingParking: '1€ to unlock',
      reservationState: 0,
      isClean: true,
      isDamaged: false,
      distance: '',
      address: 'Schwarzenbergplatz 7',
      zipCode: '1030',
      city: 'Wien',
      locationId: 2
    }
  ])

test('overwrite timeout on constructor', async t => {
  const fleetbird = new Fleetbird({ timeout: 1, url: 'http://localhost' })

  await fleetbird
    .getCars()
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('overwrite timeout on method', async t => {
  const fleetbird = new Fleetbird({ url: 'http://localhost' })

  await fleetbird
    .getCars({ timeout: 1 })
    .then(() => {
      t.fail()
    })
    .catch(err => {
      t.is(err.code, 'ETIMEDOUT')
      t.pass()
    })
})

test('get bicycles by positions', async t => {
  const fleetbird = new Fleetbird({ url: 'http://localhost' })

  await fleetbird
    .getCars()
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
