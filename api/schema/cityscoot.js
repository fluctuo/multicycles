import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Cityscoot, client, mapVehicles } from '../controllers/providers/cityscoot'

const CityscootFieldsType = new GraphQLObjectType({
  name: 'CityscootFields',
  description: 'Specific fields for Cityscoot',
  fields: {
    name: { type: GraphQLString },
    geohash: { type: GraphQLString },
    geocoding: { type: GraphQLString },
    battery: { type: GraphQLInt },
    autonomy: { type: GraphQLInt },
    plate: { type: GraphQLString },
    id_availability: { type: GraphQLInt },
    number: { type: GraphQLInt }
  }
})

const CityscootType = new GraphQLObjectType({
  name: 'Cityscoot',
  description: 'A Cityscoot vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    cityscootFields: { type: CityscootFieldsType }
  }
})

const cityscoot = {
  type: new GraphQLList(CityscootType),
  description: 'Get Cityscoot vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Cityscoot, client, mapVehicles)
  }
}

const provider = Cityscoot.getProviderDetails()

export { CityscootType, cityscoot, provider }
