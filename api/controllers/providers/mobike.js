import Mobike from '@multicycles/mobike'

const client = new Mobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.object.map(bike => ({
    id: bike.distId,
    lat: bike.distY,
    lng: bike.distX,
    type: 'BIKE',
    attributes: bike.biketype === 2 ? ['GEARS'] : [],
    provider: Mobike.getProviderDetails(),
    num: bike.distNum,
    distance: bike.distance,
    bikeIds: bike.bikeIds,
    biketype: bike.biketype,
    mobike_type: bike.type,
    boundary: bike.boundary
  }))
}

export { Mobike, client, mapVehicles }
