import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql'

import Pony from '@multicycles/pony'

import bicycleType from './bicycleType'
import logger from '../logger'

const pony = new Pony()

const ponyType = new GraphQLObjectType({
  name: 'Pony',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    manualLocation: { type: GraphQLBoolean },
    reason: { type: GraphQLString },
    region: { type: GraphQLString },
    status: { type: GraphQLString },
    userId: { type: GraphQLString }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(ponyType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await pony.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.filter(bike => bike.status === 'AVAILABLE').map(bike => ({
        id: bike.physicalId,
        lat: bike.latitude,
        lng: bike.longitude,
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

export default {
  getBicyclesByLatLng
}
