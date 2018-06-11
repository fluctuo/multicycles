import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLBoolean } from 'graphql'

import GobeeBike from '@multicycles/gobee.bike'

import { BikeType } from './bikes'
import { ProviderType } from './providers'
import logger from '../logger'

const client = new GobeeBike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const GobeeBikeType = new GraphQLObjectType({
  name: 'GobeeBike',
  description: 'A Gobee bike',
  interfaces: () => [BikeType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
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
      const result = await client.getBicyclesByLatLng({ lat, lng })

      return result.body.data.bikes.map(bike => ({
        id: bike.bid,
        number: bike.number,
        lat: bike.gLat,
        lng: bike.gLng,
        provider: {
          name: 'gobeebike'
        },
        status: bike.status,
        power: bike.power,
        hasHotspotDropoffDiscount: bike.hasHotspotDropoffDiscount,
        hotspotDropoffDiscountAmount: bike.hotspotDropoffDiscountAmount,
        lastUsageTimestamp: bike.lastUsageTimestamp,
        typeId: bike.typeId
      }))
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
