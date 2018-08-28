import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Yobike, client, mapVehicles } from '../controllers/providers/yobike'

const YobikeType = new GraphQLObjectType({
  name: 'Yobike',
  description: 'A Yobike bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    plate_no: { type: GraphQLString },
    discount: { type: GraphQLInt },
    outside: { type: GraphQLInt }
  }
})

const yobike = {
  type: new GraphQLList(YobikeType),
  description: 'Get Yobike bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Yobike, client, mapVehicles)
  }
}

const provider = Yobike.getProviderDetails()

export { YobikeType, yobike, provider }
