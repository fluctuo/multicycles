import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import IndigoWheel from '@multicycles/indigowheel'

import config from '../config'
import bicycleType from './bicycleType'

const indigoWheel = new IndigoWheel({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const indigoWheelType = new GraphQLObjectType({
  name: 'IndigoWheel',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    discount: { type: GraphQLInt },
    outside: { type: GraphQLInt }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(indigoWheelType),
  async resolve({ lat, lng }, args) {
    try {
      const result = await indigoWheel.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.data.data.map(bike => ({
        id: bike.plate_no,
        lat: bike.latitude,
        lng: bike.longitude,
        discount: bike.discount,
        outside: bike.outside
      }))
    } catch (e) {
      console.warn('[INDIGOWHEEL] - getBicyclesByLatLng', e.code, e.message, e.response)

      return []
    }
  }
}

export default {
  getBicyclesByLatLng
}
