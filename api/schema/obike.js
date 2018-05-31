import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import Obike from '@multicycles/obike'

import bicycleType from './bicycleType'
import logger from '../logger'

const obike = new Obike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const obikeType = new GraphQLObjectType({
  name: 'Obike',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    imei: { type: GraphQLString },
    iconUrl: { type: GraphQLString },
    promotionActivityType: { type: GraphQLString },
    countryId: { type: GraphQLInt },
    cityId: { type: GraphQLInt },
    helmet: { type: GraphQLInt }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(obikeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await obike.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.body.data.list.map(bike => ({
        id: bike.id,
        lat: bike.latitude,
        lng: bike.longitude,
        imei: bike.imei,
        iconUrl: bike.iconUrl,
        promotionActivityType: bike.promotionActivityType,
        countryId: bike.countryId,
        cityId: bike.cityId,
        helmet: bike.helmet
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'obike' },
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
