import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql'

import Mobike from '@multicycles/mobike'

import { BikeType } from './bikes'
import { ProviderType } from './providers'
import logger from '../logger'

const client = new Mobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const MobikeType = new GraphQLObjectType({
  name: 'Mobike',
  interfaces: () => [BikeType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    provider: { type: ProviderType },
    num: { type: GraphQLInt },
    distance: { type: GraphQLString },
    bikeIds: { type: GraphQLString },
    biketype: { type: GraphQLInt },
    type: { type: GraphQLInt },
    boundary: { type: GraphQLString }
  }
})

const mobike = {
  type: new GraphQLList(MobikeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await client.getBicyclesByLatLng({ lat, lng })

      return result.body.object.map(bike => ({
        id: bike.distId,
        lat: bike.distY,
        lng: bike.distX,
        provider: {
          name: 'mobike'
        },
        num: bike.distNum,
        distance: bike.distance,
        bikeIds: bike.bikeIds,
        biketype: bike.biketype,
        type: bike.type,
        boundary: bike.boundary
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'mobike' },
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

const provider = Mobike.getProviderDetails()

export { MobikeType, mobike, provider }
