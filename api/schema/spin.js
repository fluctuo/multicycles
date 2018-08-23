import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import Spin from '@multicycles/spin'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.vehicles.map(bike => ({
    id: `spin-${bike.last4}`,
    lat: bike.lat,
    lng: bike.lng,
    type: bike.vehicle_type === 'bicycle' ? 'BIKE' : 'SCOOTER',
    attributes: ['ELECTRIC'],
    provider: Spin.getProviderDetails(),
    last4: bike.last4,
    vehicle_type: bike.vehicle_type,
    batt_percentage: bike.batt_percentage,
    rebalance: bike.rebalance
  }))
}

const client = new Spin({
  timeout: process.env.PROVIDER_TIMEOUT || 3000
})

const SpinType = new GraphQLObjectType({
  name: 'Spin',
  description: 'A Spin vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    last4: { type: GraphQLString },
    vehicle_type: { type: GraphQLString },
    batt_percentage: { type: GraphQLInt },
    rebalance: { type: GraphQLInt }
  }
})

const spin = {
  type: new GraphQLList(SpinType),
  description: 'Get Spin vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Spin, client, mapVehicles)
  }
}

const provider = Spin.getProviderDetails()

export { SpinType, spin, provider }
