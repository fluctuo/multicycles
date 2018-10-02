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

function checkWorking() {
  const positions = [{ lat: 48.852775, lng: 2.369336 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0], { timeout: 5000 }).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Obike, client, mapVehicles, checkWorking }
