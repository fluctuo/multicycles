import Coup from '@multicycles/coup'

const client = new Coup({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.data.scooters.map(vehicle => ({
    id: vehicle.id,
    lat: vehicle.location.lat,
    lng: vehicle.location.lng,
    type: 'MOTORSCOOTER',
    attributes: ['ELECTRIC'],
    provider: Coup.getProviderDetails(),
    vin: vehicle.vin,
    model: vehicle.model,
    license_plate: vehicle.license_plate,
    energy_level: vehicle.energy_level,
    distance_to_travel: vehicle.distance_to_travel
  }))
}

export { Coup, client, mapVehicles }
