import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Wind, client, mapVehicles } from '../controllers/providers/wind'

const WindFieldsType = new GraphQLObjectType({
  name: 'WindFields',
  description: 'Specific fields for Nextbike',
  fields: {
    boardType: { type: GraphQLString },
    boardNo: { type: GraphQLString },
    lockType: { type: GraphQLString },
    currentRideId: { type: GraphQLString },
    vol: { type: GraphQLString },
    status: { type: GraphQLString },
    isLocked: { type: GraphQLString },
    isReadyForRiding: { type: GraphQLString },
    lockInfo: { type: GraphQLJSON },
    isInOperatingHours: { type: GraphQLString },
    operatingHours: { type: GraphQLJSON },
    isMobileOnline: { type: GraphQLString },
    activeTime: { type: GraphQLString },
    connectedTime: { type: GraphQLString },
    lastOpenTime: { type: GraphQLString },
    lastPingTime: { type: GraphQLString },
    openRequestTime: { type: GraphQLString }
  }
})

const WindType = new GraphQLObjectType({
  name: 'Wind',
  description: 'A Wind vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    windFields: { type: WindFieldsType }
  }
})

const wind = {
  type: new GraphQLList(WindType),
  description: 'Get Wind vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Wind, client, mapVehicles)
  }
}

const provider = Wind.getProviderDetails()

export { WindType, wind, provider }
