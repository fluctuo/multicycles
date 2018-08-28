import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Bird, client, mapVehicles } from '../controllers/providers/bird'

const BirdType = new GraphQLObjectType({
  name: 'Bird',
  description: 'A Bird scooter',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    code: { type: GraphQLString },
    battery_level: { type: GraphQLInt }
  }
})

const bird = {
  type: new GraphQLList(BirdType),
  description: 'Get Bird scooters by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Bird, client, mapVehicles)
  }
}

const provider = Bird.getProviderDetails()

export { BirdType, bird, provider }
