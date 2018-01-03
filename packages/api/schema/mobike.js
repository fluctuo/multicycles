import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString
} from 'graphql'

import mobike from '@multicycles/mobike'

import bicycleType from './bicycleType'

const mobikeType = new GraphQLObjectType({
  name: 'Mobike',
  interfaces: [bicycleType],
  fields: {
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    id: { type: GraphQLString },
    num: { type: GraphQLInt },
    distance: { type: GraphQLString },
    bikeIds: { type: GraphQLString },
    biketype: { type: GraphQLInt },
    type: { type: GraphQLInt },
    boundary: { type: GraphQLString }
  }
})

const getBicyclesByLatLng = {
  type: new GraphQLList(mobikeType),
  async resolve({ lat, lng }, args) {
    const result = await mobike.getBicyclesByLatLng({ lat, lng })

    return result.data.object.map(bike => ({
      lat: bike.distY,
      lng: bike.distX,
      id: bike.distId,
      num: bike.distNum,
      distance: bike.distance,
      bikeIds: bike.bikeIds,
      bikeType: bike.bikeType,
      type: bike.type,
      boundary: bike.boundary
    }))
  }
}

export default {
  getBicyclesByLatLng
}
