import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLBoolean } from 'graphql'

import GobeeBike from '@multicycles/gobee.bike'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'

const client = new GobeeBike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const GobeeBikeType = new GraphQLObjectType({
  name: 'GobeeBike',
  description: 'A Gobee bike',
  interfaces: () => [VehicleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    type: { type: VehicleTypeEnumType },
    attributes: { type: new GraphQLList(VehicleAttributeEnumType) },
    provider: { type: ProviderType },
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
  async resolve({ lat, lng }, args, context, info) {
    try {
      const cached = await cache.get(`gobee|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({ lat, lng })

      const formatedResult = result.body.data.bikes.map(bike => ({
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

      cache.set(`gobee|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'gobeebike' },
        extra: {
          path: info.path,
          variable: info.variableValues,
          body: context.req.body
        }
      })

      return []
    }
  }
}

const provider = GobeeBike.getProviderDetails()

export { GobeeBikeType, gobeebike, provider }
