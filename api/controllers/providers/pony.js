import Pony from '@multicycles/pony'

const client = new Pony()

function mapVehicles(result) {
  return result.filter(bike => bike.status === 'AVAILABLE').map(bike => ({
    id: bike.physicalId,
    lat: bike.latitude,
    lng: bike.longitude,
    type: 'BIKE',
    attributes: [],
    provider: Pony.getProviderDetails(),
    manualLocation: bike.manualLocation,
    reason: bike.reason,
    region: bike.region,
    status: bike.status,
    userId: bike.userId
  }))
}

export { Pony, client, mapVehicles }
