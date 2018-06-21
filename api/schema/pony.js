import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql'

import Pony from '@multicycles/pony'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'
import { requireAccessToken } from '../auth'

const client = new Pony()

const PonyType = new GraphQLObjectType({
  name: 'Pony',
  description: 'A Pony bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    manualLocation: { type: GraphQLBoolean },
    reason: { type: GraphQLString },
    region: { type: GraphQLString },
    status: { type: GraphQLString },
    userId: { type: GraphQLString }
  }
})

const pony = {
  type: new GraphQLList(PonyType),
  description: 'Get Pony bikes by position',
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
      const cached = await cache.get(`pony|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.filter(bike => bike.status === 'AVAILABLE').map(bike => ({
        id: bike.physicalId,
        lat: bike.latitude,
        lng: bike.longitude,
        type: 'BIKE',
        attributes: [],
        provider: Pony.getProviderDetails(),
        manualLocation: bike.manualLocation,
        reason: bike.reason,
        region: bike.region,
        status: bike.status,
        userId: bike.userId
      }))

      cache.set(`pony|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'pony' },
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

const provider = Pony.getProviderDetails()

export { PonyType, pony, provider }
