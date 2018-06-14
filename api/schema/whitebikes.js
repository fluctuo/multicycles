import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString } from 'graphql'

import WhiteBikes from '@multicycles/whitebikes'

import { VehicleType } from './vehicles'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'

const client = new WhiteBikes({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const WhiteBikesType = new GraphQLObjectType({
  name: 'WhiteBikes',
  description: 'A WhiteBikes bike',
  interfaces: () => [VehicleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    provider: { type: ProviderType },
    standId: { type: GraphQLString },
    bikeCount: { type: GraphQLString },
    standDescription: { type: GraphQLString },
    standName: { type: GraphQLString },
    standPhoto: { type: GraphQLString }
  }
})

const whitebikes = {
  type: new GraphQLList(WhiteBikesType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const cached = await cache.get(`whitebikes|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.map(bike => ({
        id: bike.standId,
        lat: bike.lat,
        lng: bike.lon,
        provider: {
          name: 'whitebikes'
        },
        standId: bike.standId,
        bikeCount: bike.bikecount,
        standDescription: bike.standDescription,
        standName: bike.standName,
        standPhoto: bike.standPhoto
      }))

      cache.set(`whitebikes|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'whitebikes' },
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

const provider = WhiteBikes.getProviderDetails()

export { WhiteBikesType, whitebikes, provider }
