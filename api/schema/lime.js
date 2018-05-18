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
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    plate: { type: GraphQLString }
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
        lat: bike.attributes.latitude,
        lng: bike.attributes.longitude,
        plate: bike.attributes.plate
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
