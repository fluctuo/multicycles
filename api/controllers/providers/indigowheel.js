import IndigoWheel from '@multicycles/indigowheel'

const client = new IndigoWheel({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.data.map(bike => ({
    id: bike.plate_no,
    lat: bike.latitude,
    lng: bike.longitude,
    type: 'BIKE',
    attributes: ['GEARS'],
    provider: IndigoWheel.getProviderDetails(),
    plate_no: bike.plate_no,
    discount: bike.discount,
    outside: bike.outside
  }))
}

export { IndigoWheel, client, mapVehicles }
