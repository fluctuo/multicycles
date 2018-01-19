import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString } from 'graphql'

import ofo from '@multicycles/ofo'

import config from '../config'
import bicycleType from './bicycleType'

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
  async resolve({ lat, lng }, args) {
    try {
      const result = await ofo.getBicyclesByLatLng({
        lat,
        lng,
        token: config.ofoAuthToken
      })

      return result.data.values.cars.map(bike => ({
        userIdLast: bike.userIdLast,
        lat: bike.lat,
        lng: bike.lng
      }))
    } catch (e) {
      console.warn('[OFO] - getBicyclesByLatLng', e.code, e.message, e.response)

      return []
    }
  }
}

export default {
  getBicyclesByLatLng
}
