import Hellobike from '@multicycles/hellobike'

function mapVehicles({ body }) {
  return body.data.map(o => ({
    id: o.bikeNo,
    lat: o.lat,
    lng: o.lng,
    type: 'BIKE',
    attributes: o.bikeType === 2 ? ['ELECTRIC'] : [],
    provider: Hellobike.getProviderDetails(),
    hellobikeFields: { ...o }
  }))
}

const client = new Hellobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function checkWorking() {
  const positions = [{ lat: 45.803776, lng: 126.534966 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Hellobike, client, mapVehicles, checkWorking }
