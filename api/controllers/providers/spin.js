import Spin from '@multicycles/spin'

const client = new Spin({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.vehicles.map(bike => ({
    id: `spin-${bike.last4}`,
    lat: bike.lat,
    lng: bike.lng,
    type: bike.vehicle_type === 'bicycle' ? 'BIKE' : 'SCOOTER',
    attributes: ['ELECTRIC'],
    provider: Spin.getProviderDetails(),
    last4: bike.last4,
    vehicle_type: bike.vehicle_type,
    batt_percentage: bike.batt_percentage,
    rebalance: bike.rebalance
  }))
}

export { Spin, client, mapVehicles }
