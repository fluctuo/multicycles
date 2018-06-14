import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import Yobike from '@multicycles/yobike'

import { VehicleType } from './vehicles'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'

const client = new Yobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const YobikeType = new GraphQLObjectType({
  name: 'Yobike',
  description: 'A Yobike bike',
  interfaces: () => [VehicleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    provider: { type: ProviderType },
    plate_no: { type: GraphQLString },
    discount: { type: GraphQLInt },
    outside: { type: GraphQLInt }
  }
})

const yobike = {
  type: new GraphQLList(YobikeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const cached = await cache.get(`yobike|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.body.data.map(bike => ({
        id: bike.plate_no,
        lat: bike.latitude,
        lng: bike.longitude,
        provider: {
          name: 'yobike'
        },
        plate_no: bike.plate_no,
        discount: bike.discount,
        outside: bike.outside
      }))

      cache.set(`yobike|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'yobike' },
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

const provider = Yobike.getProviderDetails()

export { YobikeType, yobike, provider }
