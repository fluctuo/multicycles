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

function checkWorking() {
  const positions = [
    { lat: 32.715736, lng: -117.161087, distance: 10000 },
    { lat: 25.71029, lng: -80.26865, distance: 10000 }
  ]
  const start = new Date()

  return Promise.all(
    positions.map(position =>
      client.getBicyclesByLatLng(position).then(result => ({
        working: !!mapVehicles(result).length,
        latency: new Date() - start
      }))
    )
  ).then(results => {
    const { working, latency } = results.reduce(
      (acc, current) => {
        return {
          working: acc.working || current.working,
          latency: acc.latency + current.latency
        }
      },
      {
        working: false,
        latency: 0
      }
    )
    return { working, latency: latency / results.length }
  })
}

export { Spin, client, mapVehicles, checkWorking }
