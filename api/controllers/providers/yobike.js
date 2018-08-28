import Yobike from '@multicycles/yobike'

const client = new Yobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.data.map(bike => ({
    id: bike.plate_no,
    lat: bike.latitude,
    lng: bike.longitude,
    type: 'BIKE',
    attributes: ['GEARS'],
    provider: Yobike.getProviderDetails(),
    plate_no: bike.plate_no,
    discount: bike.discount,
    outside: bike.outside
  }))
}

function checkWorking() {
  const positions = [{ lat: 51.454514, lng: -2.58791 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Yobike, client, mapVehicles, checkWorking }
