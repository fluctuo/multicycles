import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Mobike, client, mapVehicles } from '../controllers/providers/mobike'

const MobikeType = new GraphQLObjectType({
  name: 'Mobike',
  description: 'A Mobike bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    num: { type: GraphQLInt },
    distance: { type: GraphQLString },
    bikeIds: { type: GraphQLString },
    biketype: { type: GraphQLInt },
    mobike_type: { type: GraphQLInt },
    boundary: { type: GraphQLString }
  }
})

const mobike = {
  type: new GraphQLList(MobikeType),
  description: 'Get Mobike bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Mobike, client, mapVehicles)
  }
}

const provider = Mobike.getProviderDetails()

export { MobikeType, mobike, provider }
