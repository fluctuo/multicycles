import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLBoolean } from 'graphql'

import GobeeBike from '@multicycles/gobee.bike'

import bicycleType from './bicycleType'

const gobee = new GobeeBike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const gobeeType = new GraphQLObjectType({
  name: 'Gobee',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    number: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
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
  async resolve({ lat, lng }) {
    try {
      const result = await gobee.getBicyclesByLatLng({ lat, lng })

      return result.data.data.bikes.map(bike => ({
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
      console.warn('[GOBEE] - getBicyclesByLatLng', e.code, e.message, e.response)

      return []
    }
  }
}

export default {
  getBicyclesByLatLng
}
