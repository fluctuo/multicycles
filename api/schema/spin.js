import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import Spin from '@multicycles/spin'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'
import { requireAccessToken } from '../auth'

const client = new Spin({
  email: process.env.SPIN_AUTH_EMAIL,
  password: process.env.SPIN_AUTH_PASSWORD,
  timeout: process.env.PROVIDER_TIMEOUT || 3000
})

const SpinType = new GraphQLObjectType({
  name: 'Spin',
  description: 'A Spin vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    last4: { type: GraphQLString },
    vehicle_type: { type: GraphQLString },
    batt_percentage: { type: GraphQLInt },
    rebalance: { type: GraphQLInt }
  }
})

const spin = {
  type: new GraphQLList(SpinType),
  description: 'Get Spin vehicles by postions',
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
      const cached = await cache.get(`spin|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.body.vehicles.map(bike => ({
        id: `spin-${bike.last4}`,
        lat: bike.lat,
        lng: bike.lng,
        type: bike.vehicle_type === 'bicycle' ? 'BIKE' : 'SCOOTER',
        attributes: ['ELECTRIC'],
        provider: Spin.getProviderDetails(),
        last4: bike.last4,
        vehicle_type: bike.vehicle_type,
        batt_percentage: bike.batt_percentage,
        rebalance: bike.rebalance
      }))

      cache.set(`spin|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'spin' },
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

const provider = Spin.getProviderDetails()

export { SpinType, spin, provider }
