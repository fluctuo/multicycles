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
import { Nextbike, client, mapVehicles } from '../controllers/providers/nextbike'

const NextbikeFieldsType = new GraphQLObjectType({
  name: 'NextbikeFields',
  description: 'Specific fields for Nextbike',
  fields: {
    bike: { type: GraphQLBoolean },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    spot: { type: GraphQLBoolean },
    number: { type: GraphQLInt },
    bikes: { type: GraphQLInt },
    bike_racks: { type: GraphQLInt },
    free_racks: { type: GraphQLInt },
    maintenance: { type: GraphQLBoolean },
    terminal_type: { type: GraphQLString },
    bike_list: { type: GraphQLJSON },
    bike_numbers: { type: GraphQLJSON },
    bike_types: { type: GraphQLJSON },
    place_type: { type: GraphQLString },
    rack_locks: { type: GraphQLBoolean }
  }
})

const NextbikeType = new GraphQLObjectType({
  name: 'Nextbike',
  description: 'A Nextbike vehicle or station',
  interfaces: () => [VehicleType, StationType],
  fields: {
    ...vehicleInterfaceType,
    ...stationInterfaceType,
    nextbikeFields: { type: NextbikeFieldsType }
  }
})

const nextbike = {
  type: new GraphQLList(NextbikeType),
  description: 'Get Nextbike vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Nextbike, client, mapVehicles)
  }
}

const provider = Nextbike.getProviderDetails()

export { NextbikeType, nextbike, provider }
