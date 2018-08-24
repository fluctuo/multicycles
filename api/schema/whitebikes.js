import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { WhiteBikes, client, mapVehicles } from '../controllers/providers/whitebikes'

const WhiteBikesType = new GraphQLObjectType({
  name: 'WhiteBikes',
  description: 'A WhiteBikes bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    standId: { type: GraphQLString },
    bikeCount: { type: GraphQLString },
    standDescription: { type: GraphQLString },
    standName: { type: GraphQLString },
    standPhoto: { type: GraphQLString }
  }
})

const whitebikes = {
  type: new GraphQLList(WhiteBikesType),
  description: 'Get Whitebikes bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, WhiteBikes, client, mapVehicles)
  }
}

const provider = WhiteBikes.getProviderDetails()

export { WhiteBikesType, whitebikes, provider }
