import Donkey from '@multicycles/donkey'

const client = new Donkey({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.map(bike => {
    const data = {
      id: bike.id,
      lat: bike.latitude,
      lng: bike.longitude,
      provider: Donkey.getProviderDetails(),
      donkeyFields: {
        name: bike.name,
        radius: bike.radius,
        available_bikes_count: bike.available_bikes_count,
        thumbnail_url: bike.thumbnail_url,
        country_code: bike.country_code,
        currency: bike.currency,
        price: bike.price
      }
    }

    if (bike.available_bikes_count > 1) {
      data.type = 'STATION'
      data.isVirtual = true
      data.virtualRadius = bike.radius
      data.availableVehicles = bike.available_bikes_count
    } else {
      data.type = 'BIKE'
      data.attributes = ['GEARS']
    }

    return data
  })
}

function checkWorking() {
  const positions = [{ lat: 48.856613, lng: 2.352222 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Donkey, client, mapVehicles, checkWorking }
