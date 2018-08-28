import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'
import { Lime, client, mapVehicles } from '../controllers/providers/lime'

const LimeType = new GraphQLObjectType({
  name: 'Lime',
  description: 'A Lime vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    status: { type: GraphQLString },
    plate_number: { type: GraphQLString },
    last_activity_at: { type: GraphQLString },
    bike_icon: { type: GraphQLJSON },
    type_name: { type: GraphQLString },
    battery_level: { type: GraphQLString },
    meter_range: { type: GraphQLInt },
    rate_plan: { type: GraphQLString },
    rate_plan_short: { type: GraphQLString },
    bike_icon_id: { type: GraphQLInt },
    last_three: { type: GraphQLString }
  }
})

const lime = {
  type: new GraphQLList(LimeType),
  description: 'Get Byke bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Lime, client, mapVehicles)
  }
}

const provider = Lime.getProviderDetails()

export { LimeType, lime, provider }
