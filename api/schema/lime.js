import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString } from 'graphql'

import Lime from '@multicycles/lime'

import bicycleType from './bicycleType'
import logger from '../logger'

const lime = new Lime({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const limeType = new GraphQLObjectType({
  name: 'Lime',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    plate: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(limeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await lime.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.data.map(bike => ({
        id: bike.id,
        plate: bike.attributes.plate,
        lat: bike.attributes.latitude,
        lng: bike.attributes.longitude
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'lime' },
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
