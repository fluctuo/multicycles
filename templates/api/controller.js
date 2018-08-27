import {{ properCase provider}} from '@multicycles/{{ totalyLower provider}}'

const client = new {{ properCase provider}}({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return // @TODO map results
}

function checkWorking() {
  const positions = [{ lat: 48.856613, lng: 2.352222 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { {{ properCase provider}}, client, mapVehicles, checkWorking }
