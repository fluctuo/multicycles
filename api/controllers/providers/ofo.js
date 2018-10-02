import Ofo from '@multicycles/ofo'

const client = new Ofo({ token: process.env.OFO_AUTH_TOKEN, timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.values.cars.map(bike => ({
    id: bike.carno,
    lat: bike.lat,
    lng: bike.lng,
    type: 'BIKE',
    attributes: ['GEARS'],
    provider: Ofo.getProviderDetails(),
    carno: bike.carno,
    bomNum: bike.bomNum,
    userIdLast: bike.userIdLast
  }))
}

function checkWorking() {
  const positions = [{ lat: 48.856613, lng: 2.352222 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0], { timeout: 5000 }).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Ofo, client, mapVehicles, checkWorking }
