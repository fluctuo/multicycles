import Cityscoot from '@multicycles/cityscoot'

const client = new Cityscoot({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.data.scooters.map(o => {
    return {
      id: o.id,
      lat: o.latitude,
      lng: o.longitude,
      type: 'MOTORSCOOTER',
      attributes: ['ELECTRIC'],
      provider: Cityscoot.getProviderDetails(),
      cityscootFields: {
        name: o.name,
        geohash: o.geohash,
        geocoding: o.geocoding,
        battery: o.battery,
        autonomy: o.autonomy,
        plate: o.plate,
        id_availability: o.id_availability,
        number: o.number
      }
    }
  })
}

export { Cityscoot, client, mapVehicles }
