import GobeeBike from '@multicycles/gobee.bike'

const client = new GobeeBike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.data.bikes.map(bike => ({
    id: bike.bid,
    number: bike.number,
    lat: bike.gLat,
    lng: bike.gLng,
    type: 'BIKE',
    attributes: [],
    provider: GobeeBike.getProviderDetails(),
    status: bike.status,
    power: bike.power,
    hasHotspotDropoffDiscount: bike.hasHotspotDropoffDiscount,
    hotspotDropoffDiscountAmount: bike.hotspotDropoffDiscountAmount,
    lastUsageTimestamp: bike.lastUsageTimestamp,
    typeId: bike.typeId
  }))
}

export { GobeeBike, client, mapVehicles }
