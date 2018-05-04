import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString } from 'graphql'

import Lime from '@multicycles/lime'

import config from '../config'
import bicycleType from './bicycleType'

const lime = new Lime({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const limeType = new GraphQLObjectType({
  name: 'Lime',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    plate: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(limeType),
  async resolve({ lat, lng }, args) {
    try {
      const result = await lime.getBicyclesByLatLng({
        lat,
        lng
      })

      console.log(result.data[0])

      return result.data.map(bike => ({
        id: bike.id,
        plate: bike.attributes.plate,
        lat: bike.attributes.latitude,
        lng: bike.attributes.longitude
      }))
    } catch (e) {
      console.warn('[LIME] - getBicyclesByLatLng', e.code, e.message, e.response)

      return []
    }
  }
}

export default {
  getBicyclesByLatLng
}
