import Ofo from '@multicycles/ofo'

const client = new Ofo({ token: process.env.OFO_AUTH_TOKEN, timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.values.cars.map(bike => ({
    id: bike.carno,
    lat: bike.lat,
    lng: bike.lng,
    type: 'BIKE',
    attributes: ['GEARS'],
    provider: Ofo.getProviderDetails(),
    carno: bike.carno,
    bomNum: bike.bomNum,
    userIdLast: bike.userIdLast
  }))
}

export { Ofo, client, mapVehicles }
