import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import { VehicleType } from './vehicles'
import { StationType } from './stations'
import { vehicleInterfaceType, stationInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Donkey, client, mapVehicles } from '../controllers/providers/donkey'

const DonkeyFieldsType = new GraphQLObjectType({
  name: 'DonkeyFields',
  description: 'Specific fields for Donkey Republic',
  fields: {
    name: { type: GraphQLString },
    radius: { type: GraphQLInt },
    available_bikes_count: { type: GraphQLInt },
    thumbnail_url: { type: GraphQLString },
    country_code: { type: GraphQLString },
    currency: { type: GraphQLString },
    price: { type: GraphQLJSON }
  }
})

const DonkeyType = new GraphQLObjectType({
  name: 'Donkey',
  description: 'A Donkey bike',
  interfaces: () => [VehicleType, StationType],
  fields: {
    ...vehicleInterfaceType,
    ...stationInterfaceType,
    donkeyFields: { type: DonkeyFieldsType }
  }
})

const donkey = {
  type: new GraphQLList(DonkeyType),
  description: 'Get Donkey bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Donkey, client, mapVehicles)
  }
}

const provider = Donkey.getProviderDetails()

export { DonkeyType, donkey, provider }
