import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import Obike from '@multicycles/obike'

import config from '../config'
import bicycleType from './bicycleType'

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
  async resolve({ lat, lng }, args) {
    try {
      const result = await obike.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.data.data.list.map(bike => ({
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
      console.warn('[OBIKE] - getBicyclesByLatLng', e.code, e.message, e.response)

      return []
    }
  }
}

export default {
  getBicyclesByLatLng
}
