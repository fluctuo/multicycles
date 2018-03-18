import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql'

import Pony from '@multicycles/pony'

import config from '../config'
import bicycleType from './bicycleType'

const pony = new Pony()

const ponyType = new GraphQLObjectType({
  name: 'Pony',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    manualLocation: { type: GraphQLBoolean },
    reason: { type: GraphQLString },
    region: { type: GraphQLString },
    status: { type: GraphQLString },
    userId: { type: GraphQLString }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(ponyType),
  async resolve({ lat, lng }, args) {
    try {
      const result = await pony.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.filter(bike => bike.status === 'AVAILABLE').map(bike => ({
        id: bike.physicalId,
        lat: bike.latitude,
        lng: bike.longitude,
        manualLocation: bike.manualLocation,
        reason: bike.reason,
        region: bike.region,
        status: bike.status,
        userId: bike.userId
      }))
    } catch (e) {
      console.warn('[PONY] - getBicyclesByLatLng', e.code, e.message, e.response)

      return []
    }
  }
}

export default {
  getBicyclesByLatLng
}
