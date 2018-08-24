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

export { WhiteBikes, client, mapVehicles }
