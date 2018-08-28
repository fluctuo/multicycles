import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Ofo, client, mapVehicles } from '../controllers/providers/ofo'

const OfoType = new GraphQLObjectType({
  name: 'Ofo',
  description: 'A Ofo bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    carno: { type: GraphQLString },
    bomNum: { type: GraphQLString },
    userIdLast: { type: GraphQLString }
  }
})

const ofo = {
  type: new GraphQLList(OfoType),
  description: 'Get Ofo bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Ofo, client, mapVehicles)
  }
}

const provider = Ofo.getProviderDetails()

export { OfoType, ofo, provider }
