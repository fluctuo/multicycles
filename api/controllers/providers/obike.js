import Obike from '@multicycles/obike'

const client = new Obike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.data.list.map(bike => ({
    id: bike.id,
    lat: bike.latitude,
    lng: bike.longitude,
    type: 'BIKE',
    attributes: [],
    provider: Obike.getProviderDetails(),
    imei: bike.imei,
    iconUrl: bike.iconUrl,
    promotionActivityType: bike.promotionActivityType,
    countryId: bike.countryId,
    cityId: bike.cityId,
    helmet: bike.helmet
  }))
}

export { Obike, client, mapVehicles }
