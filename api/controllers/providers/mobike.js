import Mobike from '@multicycles/mobike'

const client = new Mobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.object.map(bike => ({
    id: bike.distId,
    lat: bike.distY,
    lng: bike.distX,
    type: 'BIKE',
    attributes: bike.biketype === 2 ? ['GEARS'] : [],
    provider: Mobike.getProviderDetails(),
    num: bike.distNum,
    distance: bike.distance,
    bikeIds: bike.bikeIds,
    biketype: bike.biketype,
    mobike_type: bike.type,
    boundary: bike.boundary
  }))
}

function checkWorking() {
  const positions = [{ lat: 48.856613, lng: 2.352222 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Mobike, client, mapVehicles, checkWorking }
