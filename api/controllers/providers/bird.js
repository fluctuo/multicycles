import Bird from '@multicycles/bird'

const client = new Bird({ token: process.env.BIRD_AUTH_TOKEN, timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.birds.map(bike => ({
    id: bike.id,
    lat: bike.location.latitude,
    lng: bike.location.longitude,
    type: 'SCOOTER',
    attributes: ['ELECTRIC'],
    provider: Bird.getProviderDetails(),
    code: bike.code,
    battery_level: bike.battery_level
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

export { Bird, client, mapVehicles, checkWorking }
