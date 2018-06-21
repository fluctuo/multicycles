import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql'

import Jump from '@multicycles/jump'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'
import { requireAccessToken } from '../auth'

const client = new Jump({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const JumpType = new GraphQLObjectType({
  name: 'Jump',
  description: 'A Jump vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    name: { type: GraphQLString },
    is_reserved: { type: GraphQLInt },
    is_disabled: { type: GraphQLInt },
    jump_ebike_battery_level: { type: GraphQLString }
  }
})

const jump = {
  type: new GraphQLList(JumpType),
  description: 'Get Jump bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, { lat, lng }, ctx, info) {
    requireAccessToken(ctx.state.accessToken)

    try {
      const cached = await cache.get(`jump|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({ lat, lng })

      const formatedResult = result.body.data.bikes.map(bike => ({
        id: bike.bike_id,
        lat: bike.lat,
        lng: bike.lon,
        type: 'BIKE',
        attributes: ['GEARS', 'ELECTRIC'],
        provider: Jump.getProviderDetails(),
        name: bike.name,
        is_reserved: bike.is_reserved,
        is_disabled: bike.is_disabled,
        jump_ebike_battery_level: bike.jump_ebike_battery_level
      }))

      cache.set(`jump|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'jump' },
        extra: {
          path: info.path,
          variable: info.variableValues,
          body: ctx.req.body
        }
      })

      return []
    }
  }
}

const provider = Jump.getProviderDetails()

export { JumpType, jump, provider }
