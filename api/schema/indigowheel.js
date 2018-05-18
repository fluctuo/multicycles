import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import IndigoWheel from '@multicycles/indigowheel'

import bicycleType from './bicycleType'
import logger from '../logger'

const indigoWheel = new IndigoWheel({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const indigoWheelType = new GraphQLObjectType({
  name: 'IndigoWheel',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    plate_no: { type: GraphQLString },
    discount: { type: GraphQLInt },
    outside: { type: GraphQLInt }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(indigoWheelType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await indigoWheel.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.data.data.map(bike => ({
        id: bike.plate_no,
        lat: bike.latitude,
        lng: bike.longitude,
        plate_no: bike.plate_no,
        discount: bike.discount,
        outside: bike.outside
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'indigowheel' },
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
