import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql'

import gobee from './gobee'
import ofo from './ofo'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      bicyclesByLatLng: {
        type: new GraphQLObjectType({
          name: 'BicyclesByLatLng',
          fields: {
            gobee: gobee.getBicyclesByLatLng,
            ofo: ofo.getBicyclesByLatLng
          }
        }),
        args: {
          lat: {
            type: new GraphQLNonNull(GraphQLFloat)
          },
          lng: {
            type: new GraphQLNonNull(GraphQLFloat)
          }
        },
        resolve: (root, args) => args
      }
    }
  })
})
