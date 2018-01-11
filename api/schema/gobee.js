import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLBoolean } from 'graphql'

import gobee from '@multicycles/gobee.bike'

import bicycleType from './bicycleType'

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
  }
}

export default {
  getBicyclesByLatLng
}
