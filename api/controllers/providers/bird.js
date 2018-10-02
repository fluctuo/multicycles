import Bird from '@multicycles/bird'
import tunnel from 'tunnel-agent'

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

  return client
    .getBicyclesByLatLng(
      positions[0],
      {
        agent: tunnel.httpsOverHttp({
          proxy: {
            host: process.env.PROXY_HOST,
            port: process.env.PROXY_PORT,
            proxyAuth: process.env.PROXY_AUTH
          }
        })
      },
      { timeout: 5000 }
    )
    .then(result => ({
      working: !!mapVehicles(result).length,
      latency: new Date() - start
    }))
}

export { Bird, client, mapVehicles, checkWorking }
