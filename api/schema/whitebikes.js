import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString } from 'graphql'

import WhiteBikes from '@multicycles/whitebikes'

import config from '../config'
import bicycleType from './bicycleType'

const whiteBikes = new WhiteBikes({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const whiteBikesType = new GraphQLObjectType({
  name: 'WhiteBikes',
  interfaces: [bicycleType],
  fields: {
    standId: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    bikeCount: { type: GraphQLString },
    standDescription: { type: GraphQLString },
    standName: { type: GraphQLString },
    standPhoto: { type: GraphQLString }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(whiteBikesType),
  async resolve({ lat, lng }, args) {
    try {
      const result = await whiteBikes.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.map(bike => ({
        standId: bike.standId,
        lat: bike.lat,
        lng: bike.lon,
        bikeCount: bike.bikecount,
        standDescription: bike.standDescription,
        standName: bike.standName,
        standPhoto: bike.standPhoto
      }))
    } catch (e) {
      console.warn('[WHITEBIKES] - getBicyclesByLatLng', e.code, e.message, e.response)

      return []
    }
  }
}

export default {
  getBicyclesByLatLng
}
