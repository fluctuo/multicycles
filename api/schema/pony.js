import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql'

import Pony from '@multicycles/pony'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles(result) {
  return result.filter(bike => bike.status === 'AVAILABLE').map(bike => ({
    id: bike.physicalId,
    lat: bike.latitude,
    lng: bike.longitude,
    type: 'BIKE',
    attributes: [],
    provider: Pony.getProviderDetails(),
    manualLocation: bike.manualLocation,
    reason: bike.reason,
    region: bike.region,
    status: bike.status,
    userId: bike.userId
  }))
}

const client = new Pony()

const PonyType = new GraphQLObjectType({
  name: 'Pony',
  description: 'A Pony bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    manualLocation: { type: GraphQLBoolean },
    reason: { type: GraphQLString },
    region: { type: GraphQLString },
    status: { type: GraphQLString },
    userId: { type: GraphQLString }
  }
})

const pony = {
  type: new GraphQLList(PonyType),
  description: 'Get Pony bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Pony, client, mapVehicles)
  }
}

const provider = Pony.getProviderDetails()

export { PonyType, pony, provider }
