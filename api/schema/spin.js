import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Spin, client, mapVehicles } from '../controllers/providers/spin'

const SpinType = new GraphQLObjectType({
  name: 'Spin',
  description: 'A Spin vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    last4: { type: GraphQLString },
    vehicle_type: { type: GraphQLString },
    batt_percentage: { type: GraphQLInt },
    rebalance: { type: GraphQLInt }
  }
})

const spin = {
  type: new GraphQLList(SpinType),
  description: 'Get Spin vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Spin, client, mapVehicles)
  }
}

const provider = Spin.getProviderDetails()

export { SpinType, spin, provider }
