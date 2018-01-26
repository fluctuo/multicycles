import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql'

import jump from '@multicycles/jump'

import bicycleType from './bicycleType'

const jumpType = new GraphQLObjectType({
  name: 'Jump',
  interfaces: [bicycleType],
  fields: {
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    is_reserved: { type: GraphQLInt },
    is_disabled: { type: GraphQLInt },
    jump_ebike_battery_level: { type: GraphQLString }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(jumpType),
  async resolve({ lat, lng }, args) {
    try {
      const result = await jump.getBicyclesByLatLng({ lat, lng })

      return result.data.data.bikes.map(bike => ({
        lat: bike.lat,
        lng: bike.lon,
        id: bike.bike_id,
        name: bike.name,
        is_reserved: bike.is_reserved,
        is_disabled: bike.is_disabled,
        jump_ebike_battery_level: bike.jump_ebike_battery_level
      }))
    } catch (e) {
      console.warn('[JUMP] - getBicyclesByLatLng', e.code, e.message, e.response)

      return []
    }
  }
}

export default {
  getBicyclesByLatLng
}
