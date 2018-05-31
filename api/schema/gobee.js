import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLBoolean } from 'graphql'

import GobeeBike from '@multicycles/gobee.bike'

import bicycleType from './bicycleType'
import logger from '../logger'

const gobee = new GobeeBike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const gobeeType = new GraphQLObjectType({
  name: 'Gobee',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    number: { type: GraphQLString },
    status: { type: GraphQLInt },
    power: { type: GraphQLInt },
    hasHotspotDropoffDiscount: { type: GraphQLBoolean },
    hotspotDropoffDiscountAmount: { type: GraphQLBoolean },
    lastUsageTimestamp: { type: GraphQLInt },
    typeId: { type: GraphQLInt }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(gobeeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await gobee.getBicyclesByLatLng({ lat, lng })

      return result.body.data.bikes.map(bike => ({
        id: bike.bid,
        number: bike.number,
        lat: bike.gLat,
        lng: bike.gLng,
        status: bike.status,
        power: bike.power,
        hasHotspotDropoffDiscount: bike.hasHotspotDropoffDiscount,
        hotspotDropoffDiscountAmount: bike.hotspotDropoffDiscountAmount,
        lastUsageTimestamp: bike.lastUsageTimestamp,
        typeId: bike.typeId
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'gobee' },
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

export default {
  getBicyclesByLatLng
}
