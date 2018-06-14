import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql'

import Pony from '@multicycles/pony'

import { VehicleType } from './vehicles'
import { ProviderType } from './providers'
import logger from '../logger'

const client = new Pony()

const PonyType = new GraphQLObjectType({
  name: 'Pony',
  description: 'A Pony bike',
  interfaces: () => [VehicleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    provider: { type: ProviderType },
    manualLocation: { type: GraphQLBoolean },
    reason: { type: GraphQLString },
    region: { type: GraphQLString },
    status: { type: GraphQLString },
    userId: { type: GraphQLString }
  }
})

const pony = {
  type: new GraphQLList(PonyType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.filter(bike => bike.status === 'AVAILABLE').map(bike => ({
        id: bike.physicalId,
        lat: bike.latitude,
        lng: bike.longitude,
        provider: {
          name: 'pony'
        },
        manualLocation: bike.manualLocation,
        reason: bike.reason,
        region: bike.region,
        status: bike.status,
        userId: bike.userId
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'pony' },
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

const provider = Pony.getProviderDetails()

export { PonyType, pony, provider }
