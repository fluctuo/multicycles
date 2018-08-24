import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Jump, client, mapVehicles } from '../controllers/providers/jump'

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
