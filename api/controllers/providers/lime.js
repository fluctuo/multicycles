import Lime from '@multicycles/lime'

const client = new Lime({
  auth: {
    token: process.env.LIME_AUTH_TOKEN,
    session: process.env.LIME_AUTH_SESSION
  },
  timeout: process.env.PROVIDER_TIMEOUT || 3000
})

function getAttributes(attrs) {
  const attributes = []

  if (attributes.type_name === 'electric' || attributes.type_name === 'manual') {
    attributes.push('GEARS')
  }

  if (attrs.type_name === 'scooter' || attrs.type_name === 'electric') {
    attributes.push('ELECTRIC')
  }

  return attributes
}

function mapVehicles({ body }) {
  return body.data.attributes.nearby_locked_bikes.map(bike => ({
    id: bike.id,
    lat: bike.attributes.latitude,
    lng: bike.attributes.longitude,
    type: bike.attributes.type_name === 'scooter' ? 'SCOOTER' : 'BIKE',
    attributes: getAttributes(bike.attributes),
    provider: Lime.getProviderDetails(),
    status: bike.attributes.status,
    plate_number: bike.attributes.plate_number,
    last_activity_at: bike.attributes.last_activity_at,
    bike_icon: bike.attributes.bike_icon,
    type_name: bike.attributes.type_name,
    battery_level: bike.attributes.battery_level,
    meter_range: bike.attributes.meter_range,
    rate_plan: bike.attributes.rate_plan,
    rate_plan_short: bike.attributes.rate_plan_short,
    bike_icon_id: bike.attributes.bike_icon_id,
    last_three: bike.attributes.last_three
  }))
}

function checkWorking() {
  const positions = [{ lat: 48.856613, lng: 2.352222 }]
  const start = new Date()

  return client.getBicyclesByLatLng(positions[0]).then(result => ({
    working: !!mapVehicles(result).length,
    latency: new Date() - start
  }))
}

export { Lime, client, mapVehicles, checkWorking }
