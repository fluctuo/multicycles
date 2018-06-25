import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql'

import Jump from '@multicycles/jump'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.data.bikes.map(bike => ({
    id: bike.bike_id,
    lat: bike.lat,
    lng: bike.lon,
    type: 'BIKE',
    attributes: ['GEARS', 'ELECTRIC'],
    provider: Jump.getProviderDetails(),
    name: bike.name,
    is_reserved: bike.is_reserved,
    is_disabled: bike.is_disabled,
    jump_ebike_battery_level: bike.jump_ebike_battery_level
  }))
}

const client = new Jump({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const JumpType = new GraphQLObjectType({
  name: 'Jump',
  description: 'A Jump vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    name: { type: GraphQLString },
    is_reserved: { type: GraphQLInt },
    is_disabled: { type: GraphQLInt },
    jump_ebike_battery_level: { type: GraphQLString }
  }
})

const jump = {
  type: new GraphQLList(JumpType),
  description: 'Get Jump bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Jump, client, mapVehicles)
  }
}

const provider = Jump.getProviderDetails()

export { JumpType, jump, provider }
