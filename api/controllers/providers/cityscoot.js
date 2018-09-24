import cache from '../../cache'
import Cityscoot from '@multicycles/cityscoot'

const client = new Cityscoot({
  timeout: process.env.PROVIDER_TIMEOUT || 3000,
  datastore: {
    store: cache,
    ttl: {
      cities: 1 * 60 * 60,
      vehicles: 2 * 60
    }
  }
})

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

function checkWorking() {
  const positions = [{ lat: 48.856613, lng: 2.352222 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Cityscoot, client, mapVehicles, checkWorking }
