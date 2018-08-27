import IndigoWheel from '@multicycles/indigowheel'

const client = new IndigoWheel({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.data.map(bike => ({
    id: bike.plate_no,
    lat: bike.latitude,
    lng: bike.longitude,
    type: 'BIKE',
    attributes: ['GEARS'],
    provider: IndigoWheel.getProviderDetails(),
    plate_no: bike.plate_no,
    discount: bike.discount,
    outside: bike.outside
  }))
}

function checkWorking() {
  const positions = [{ lat: 45.764042, lng: 4.835659 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { IndigoWheel, client, mapVehicles, checkWorking }
