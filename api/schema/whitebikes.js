import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLNonNull } from 'graphql'

import WhiteBikes from '@multicycles/whitebikes'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles(result) {
  return result.map(bike => ({
    id: bike.standId,
    lat: bike.lat,
    lng: bike.lon,
    type: 'BIKE',
    attributes: [],
    provider: WhiteBikes.getProviderDetails(),
    standId: bike.standId,
    bikeCount: bike.bikecount,
    standDescription: bike.standDescription,
    standName: bike.standName,
    standPhoto: bike.standPhoto
  }))
}

const client = new WhiteBikes({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const WhiteBikesType = new GraphQLObjectType({
  name: 'WhiteBikes',
  description: 'A WhiteBikes bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    standId: { type: GraphQLString },
    bikeCount: { type: GraphQLString },
    standDescription: { type: GraphQLString },
    standName: { type: GraphQLString },
    standPhoto: { type: GraphQLString }
  }
})

const whitebikes = {
  type: new GraphQLList(WhiteBikesType),
  description: 'Get Whitebikes bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, WhiteBikes, client, mapVehicles)
  }
}

const provider = WhiteBikes.getProviderDetails()

export { WhiteBikesType, whitebikes, provider }
