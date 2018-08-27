import Byke from '@multicycles/byke'

const client = new Byke({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.items.map(bike => ({
    id: bike.bikeNo,
    lat: bike.latitude,
    lng: bike.longitude,
    type: 'BIKE',
    attributes: ['GEARS'],
    provider: Byke.getProviderDetails(),
    bikeId: bike.bikeId,
    bikeType: bike.bikeType,
    bikeNo: bike.bikeNo,
    lockType: bike.lockType,
    pricingUnit: bike.pricingUnit,
    pricingAmount: bike.pricingAmount,
    currentRideId: bike.currentRideId,
    vol: bike.vol,
    status: bike.status,
    isLocked: bike.isLocked,
    isReadyForRiding: bike.isReadyForRiding
  }))
}

function checkWorking() {
  const positions = [{ lat: 52.520008, lng: 13.404954 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { client, Byke, mapVehicles, checkWorking }
