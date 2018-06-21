import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import Obike from '@multicycles/obike'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'
import { requireAccessToken } from '../auth'

const client = new Obike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const ObikeType = new GraphQLObjectType({
  name: 'Obike',
  description: 'A Obike bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    imei: { type: GraphQLString },
    iconUrl: { type: GraphQLString },
    promotionActivityType: { type: GraphQLString },
    countryId: { type: GraphQLInt },
    cityId: { type: GraphQLInt },
    helmet: { type: GraphQLInt }
  }
})

const obike = {
  type: new GraphQLList(ObikeType),
  description: 'Get Obike bikes by position',
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
      const cached = await cache.get(`obike|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.body.data.list.map(bike => ({
        id: bike.id,
        lat: bike.latitude,
        lng: bike.longitude,
        type: 'BIKE',
        attributes: [],
        provider: Obike.getProviderDetails(),
        imei: bike.imei,
        iconUrl: bike.iconUrl,
        promotionActivityType: bike.promotionActivityType,
        countryId: bike.countryId,
        cityId: bike.cityId,
        helmet: bike.helmet
      }))

      cache.set(`obike|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'obike' },
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

const provider = Obike.getProviderDetails()

export { ObikeType, obike, provider }
