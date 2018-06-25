import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import Lime from '@multicycles/lime'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

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

const client = new Lime({
  auth: {
    token: process.env.LIME_AUTH_TOKEN,
    session: process.env.LIME_AUTH_SESSION
  },
  timeout: process.env.PROVIDER_TIMEOUT || 3000
})

const LimeType = new GraphQLObjectType({
  name: 'Lime',
  description: 'A Lime vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    status: { type: GraphQLString },
    plate_number: { type: GraphQLString },
    last_activity_at: { type: GraphQLString },
    bike_icon: { type: GraphQLJSON },
    type_name: { type: GraphQLString },
    battery_level: { type: GraphQLString },
    meter_range: { type: GraphQLInt },
    rate_plan: { type: GraphQLString },
    rate_plan_short: { type: GraphQLString },
    bike_icon_id: { type: GraphQLInt },
    last_three: { type: GraphQLString }
  }
})

const lime = {
  type: new GraphQLList(LimeType),
  description: 'Get Byke bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Lime, client, mapVehicles)
  }
}

const provider = Lime.getProviderDetails()

export { LimeType, lime, provider }
