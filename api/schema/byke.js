import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Byke, client, mapVehicles } from '../controllers/providers/byke'

const BykeType = new GraphQLObjectType({
  name: 'Byke',
  description: 'A Byke bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    bikeId: { type: GraphQLString },
    bikeType: { type: GraphQLString },
    bikeNo: { type: GraphQLString },
    lockType: { type: GraphQLString },
    pricingUnit: { type: GraphQLInt },
    pricingAmount: { type: GraphQLInt },
    currentRideId: { type: GraphQLString },
    vol: { type: GraphQLString },
    status: { type: GraphQLInt },
    isLocked: { type: GraphQLInt },
    isReadyForRiding: { type: GraphQLInt }
  }
})

const byke = {
  type: new GraphQLList(BykeType),
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
    return resolve(args, ctx, info, Byke, client, mapVehicles)
  }
}

const provider = Byke.getProviderDetails()

export { BykeType, byke, provider }
