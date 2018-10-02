import WhiteBikes from '@multicycles/whitebikes'

const client = new WhiteBikes({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles(result) {
  return result.map(bike => ({
    id: bike.standId,
    lat: bike.lat,
    lng: bike.lon,
    type: 'BIKE',
    attributes: [],
    provider: WhiteBikes.getProviderDetails(),
    standId: bike.standId,
    bikeCount: bike.bikecount,
    standDescription: bike.standDescription,
    standName: bike.standName,
    standPhoto: bike.standPhoto
  }))
}

function checkWorking() {
  const positions = [{ lat: 48.148598, lng: 17.107748 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0], { timeout: 5000 }).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { WhiteBikes, client, mapVehicles, checkWorking }
