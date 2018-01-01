import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLFloat,
  GraphQLString
} from 'graphql'

import ofo from '@multicycles/ofo'

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
    const result = await ofo.getBicyclesByLatLng({ lat, lng })

    return result.data.values.cars.map(bike => ({
      userIdLast: bike.userIdLast,
      lat: bike.lat,
      lng: bike.lng
    }))
  }
}

export default {
  getBicyclesByLatLng
}
