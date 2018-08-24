import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Obike, client, mapVehicles } from '../controllers/providers/obike'

const ObikeType = new GraphQLObjectType({
  name: 'Obike',
  description: 'A Obike bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    imei: { type: GraphQLString },
    iconUrl: { type: GraphQLString },
    promotionActivityType: { type: GraphQLString },
    countryId: { type: GraphQLInt },
    cityId: { type: GraphQLInt },
    helmet: { type: GraphQLInt }
  }
})

const obike = {
  type: new GraphQLList(ObikeType),
  description: 'Get Obike bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Obike, client, mapVehicles)
  }
}

const provider = Obike.getProviderDetails()

export { ObikeType, obike, provider }
