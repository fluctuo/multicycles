import Jump from '@multicycles/jump'

const client = new Jump({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.data.bikes.map(bike => ({
    id: bike.bike_id,
    lat: bike.lat,
    lng: bike.lon,
    type: 'BIKE',
    attributes: ['GEARS', 'ELECTRIC'],
    provider: Jump.getProviderDetails(),
    name: bike.name,
    is_reserved: bike.is_reserved,
    is_disabled: bike.is_disabled,
    jump_ebike_battery_level: bike.jump_ebike_battery_level
  }))
}

function checkWorking() {
  const positions = [{ lat: 38.907192, lng: -77.036871 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Jump, client, mapVehicles, checkWorking }
