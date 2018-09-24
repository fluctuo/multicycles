import Pony from '@multicycles/pony'
import cache from '../../cache'

const client = new Pony({
  datastore: {
    store: cache,
    ttl: {
      vehicles: 2 * 60
    }
  }
})

function mapVehicles({ body }) {
  return body.filter(bike => bike.status === 'AVAILABLE').map(bike => ({
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

function checkWorking() {
  const positions = [{ lat: 51.752022, lng: -1.257726 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Pony, client, mapVehicles, checkWorking }
