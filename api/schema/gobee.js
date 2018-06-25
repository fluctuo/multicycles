import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql'

import GobeeBike from '@multicycles/gobee.bike'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.data.bikes.map(bike => ({
    id: bike.bid,
    number: bike.number,
    lat: bike.gLat,
    lng: bike.gLng,
    type: 'BIKE',
    attributes: [],
    provider: GobeeBike.getProviderDetails(),
    status: bike.status,
    power: bike.power,
    hasHotspotDropoffDiscount: bike.hasHotspotDropoffDiscount,
    hotspotDropoffDiscountAmount: bike.hotspotDropoffDiscountAmount,
    lastUsageTimestamp: bike.lastUsageTimestamp,
    typeId: bike.typeId
  }))
}

const client = new GobeeBike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const GobeeBikeType = new GraphQLObjectType({
  name: 'GobeeBike',
  description: 'A Gobee bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    number: { type: GraphQLString },
    status: { type: GraphQLInt },
    power: { type: GraphQLInt },
    hasHotspotDropoffDiscount: { type: GraphQLBoolean },
    hotspotDropoffDiscountAmount: { type: GraphQLBoolean },
    lastUsageTimestamp: { type: GraphQLInt },
    typeId: { type: GraphQLInt }
  }
})

const gobeebike = {
  type: new GraphQLList(GobeeBikeType),
  description: 'Get Gobee bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, GobeeBike, client, mapVehicles)
  }
}

const provider = GobeeBike.getProviderDetails()

export { GobeeBikeType, gobeebike, provider }
