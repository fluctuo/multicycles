import Yobike from '@multicycles/yobike'

const client = new Yobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.data.map(bike => ({
    id: bike.plate_no,
    lat: bike.latitude,
    lng: bike.longitude,
    type: 'BIKE',
    attributes: ['GEARS'],
    provider: Yobike.getProviderDetails(),
    plate_no: bike.plate_no,
    discount: bike.discount,
    outside: bike.outside
  }))
}

export { Yobike, client, mapVehicles }
