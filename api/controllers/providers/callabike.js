import CallABike from '@multicycles/callabike'

const client = new CallABike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

function mapVehicles({ body }) {
  return body.result.data.Locations.map(o => {
    const data = {
      id: o.objectId,
      lat: o.Position.Latitude,
      lng: o.Position.Longitude,
      provider: CallABike.getProviderDetails(),
      callabikeFields: {
        position: o.Position,
        description: o.Description,
        distance: o.Distance,
        isOutside: o.isOutside,
        virtStationRadius: o.virtStationRadius,
        objectId: o.objectId,
        objectName: o.objectName,
        isStation: o.isStation,
        isPedelec: o.isPedelec,
        totalVehicles: o.totalVehicles,
        markenName: o.markenName,
        city: o.city,
        freeBikes: o.FreeBikes
      }
    }

    if (o.isStation) {
      // Classic station
      if (o.maxSlots) {
        data.type = 'STATION'
      } else {
        // Virtual station, set as BIKE if only one bike available
        data.type = o.totalVehicles === 1 ? 'BIKE' : 'STATION'
      }
    } else {
      data.type = 'BIKE'
    }

    if (data.type === 'STATION') {
      data.available_vehicles = o.totalVehicles
      data.availableVehicles = o.totalVehicles
      data.available_stands = o.maxSlots ? o.maxSlots - o.totalVehicles : undefined
      data.availableStands = o.maxSlots ? o.maxSlots - o.totalVehicles : undefined
      data.total_stands = o.maxSlots
      data.totalStands = o.maxSlots
      data.isVirtual = true
      data.virtualRadius = o.virtStationRadius
    } else {
      data.attributes = o.isPedelec ? ['ELECTRIC'] : ['GEARS']
    }

    return data
  })
}

function checkWorking() {
  const positions = [{ lat: 52.520008, lng: 13.404954 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { CallABike, client, mapVehicles, checkWorking }
