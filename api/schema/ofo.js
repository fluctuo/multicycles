import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString } from 'graphql'

import Ofo from '@multicycles/ofo'

import config from '../config'
import bicycleType from './bicycleType'
import logger from '../logger'

const ofo = new Ofo({ token: config.ofoAuthToken, timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const ofoType = new GraphQLObjectType({
  name: 'Ofo',
  interfaces: [bicycleType],
  fields: {
    userIdLast: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(ofoType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await ofo.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.data.values.cars.map(bike => ({
        userIdLast: bike.userIdLast,
        lat: bike.lat,
        lng: bike.lng
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'ofo' },
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
