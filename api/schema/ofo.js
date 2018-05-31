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
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    carno: { type: GraphQLString },
    bomNum: { type: GraphQLString },
    userIdLast: { type: GraphQLString }
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

      return result.body.values.cars.map(bike => ({
        id: bike.carno,
        lat: bike.lat,
        lng: bike.lng,
        carno: bike.carno,
        bomNum: bike.bomNum,
        userIdLast: bike.userIdLast
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
