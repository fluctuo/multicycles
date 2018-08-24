import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Coup, client, mapVehicles } from '../controllers/providers/coup'

const CoupType = new GraphQLObjectType({
  name: 'Coup',
  description: 'A Coup vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    vin: { type: GraphQLString },
    model: { type: GraphQLString },
    license_plate: { type: GraphQLString },
    energy_level: { type: GraphQLInt },
    distance_to_travel: { type: GraphQLFloat }
  }
})

const coup = {
  type: new GraphQLList(CoupType),
  description: 'Get Coup vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Coup, client, mapVehicles)
  }
}

const provider = Coup.getProviderDetails()

export { CoupType, coup, provider }
