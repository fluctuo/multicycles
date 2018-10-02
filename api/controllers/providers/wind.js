import Wind from '@multicycles/wind'

const client = new Wind({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.items.map(scooter => ({
    id: scooter.boardNo,
    lat: scooter.latitude,
    lng: scooter.longitude,
    type: 'SCOOTER',
    attributes: ['ELECTRIC'],
    provider: Wind.getProviderDetails(),
    windFields: {
      boardType: scooter.boardType,
      boardNo: scooter.boardNo,
      lockType: scooter.lockType,
      currentRideId: scooter.currentRideId,
      vol: scooter.vol,
      status: scooter.status,
      isLocked: scooter.isLocked,
      isReadyForRiding: scooter.isReadyForRiding,
      lockInfo: scooter.lockInfo,
      isInOperatingHours: scooter.isInOperatingHours,
      operatingHours: scooter.operatingHours,
      isMobileOnline: scooter.isMobileOnline,
      activeTime: scooter.activeTime,
      connectedTime: scooter.connectedTime,
      lastOpenTime: scooter.lastOpenTime,
      lastPingTime: scooter.lastPingTime,
      openRequestTime: scooter.openRequestTime
    }
  }))
}

function checkWorking() {
  const positions = [{ lat: 48.856613, lng: 2.352222 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0], { timeout: 5000 }).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Wind, client, mapVehicles, checkWorking }
