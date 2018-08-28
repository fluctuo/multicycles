import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLFloat,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import { VehicleType } from './vehicles'
import { StationType } from './stations'
import { vehicleInterfaceType, stationInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { CallABike, client, mapVehicles } from '../controllers/providers/callabike'

const CallABikeFieldsType = new GraphQLObjectType({
  name: 'CallABikeFields',
  description: 'Specific fields for Call a Bike',
  fields: {
    position: { type: GraphQLJSON },
    description: { type: GraphQLString },
    distance: { type: GraphQLString },
    isOutside: { type: GraphQLBoolean },
    virtStationRadius: { type: GraphQLInt },
    objectId: { type: GraphQLInt },
    objectName: { type: GraphQLString },
    isStation: { type: GraphQLBoolean },
    isPedelec: { type: GraphQLBoolean },
    totalVehicles: { type: GraphQLInt },
    markenName: { type: GraphQLString },
    city: { type: GraphQLString },
    freeBikes: { type: GraphQLJSON }
  }
})

const CallABikeType = new GraphQLObjectType({
  name: 'CallABike',
  description: 'A Call a Bike vehicle',
  interfaces: () => [VehicleType, StationType],
  fields: {
    ...vehicleInterfaceType,
    ...stationInterfaceType,
    callabikeFields: { type: CallABikeFieldsType }
  }
})

const callabike = {
  type: new GraphQLList(CallABikeType),
  description: 'Get Call a Bike vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, CallABike, client, mapVehicles)
  }
}

const provider = CallABike.getProviderDetails()

export { CallABikeType, callabike, provider }
