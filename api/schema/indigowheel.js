import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { IndigoWheel, client, mapVehicles } from '../controllers/providers/indigowheel'

const IndigoWheelType = new GraphQLObjectType({
  name: 'IndigoWheel',
  description: 'A IndigoWheel bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    plate_no: { type: GraphQLString },
    discount: { type: GraphQLInt },
    outside: { type: GraphQLInt }
  }
})

const indigowheel = {
  type: new GraphQLList(IndigoWheelType),
  description: 'Get Indigo Wheel bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, IndigoWheel, client, mapVehicles)
  }
}

const provider = IndigoWheel.getProviderDetails()

export { indigowheel, IndigoWheelType, provider }
