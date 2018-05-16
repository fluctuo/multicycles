import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql'

import Jump from '@multicycles/jump'

import bicycleType from './bicycleType'
import logger from '../logger'

const jump = new Jump({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

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
  async resolve({ lat, lng }, args, context, info) {
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
      logger.exception(e, {
        tags: { provider: 'jump' },
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
