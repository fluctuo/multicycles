import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString } from 'graphql'

import Yobike from '@multicycles/yobike'

import config from '../config'
import bicycleType from './bicycleType'

const yobike = new Yobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const yobikeType = new GraphQLObjectType({
  name: 'Yobike',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(yobikeType),
  async resolve({ lat, lng }, args) {
    try {
      const result = await yobike.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.data.data.map(bike => ({
        id: bike.plate_no,
        lat: bike.latitude,
        lng: bike.longitude
      }))
    } catch (e) {
      console.warn('[YOBIKE] - getBicyclesByLatLng', e.code, e.message, e.response)

      return []
    }
  }
}

export default {
  getBicyclesByLatLng
}
