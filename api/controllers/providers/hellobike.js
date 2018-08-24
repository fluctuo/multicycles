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

export { Hellobike, client, mapVehicles }
