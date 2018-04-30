import { GraphQLSchema, GraphQLObjectType, GraphQLFloat, GraphQLNonNull } from 'graphql'

import gobee from './gobee'
import ofo from './ofo'
import mobike from './mobike'
import yobike from './yobike'
import jump from './jump'
import pony from './pony'
import lime from './lime'
import capacities from './capacities'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      capacities,
      bicyclesByLatLng: {
        type: new GraphQLObjectType({
          name: 'BicyclesByLatLng',
          fields: {
            gobee: gobee.getBicyclesByLatLng,
            ofo: ofo.getBicyclesByLatLng,
            mobike: mobike.getBicyclesByLatLng,
            yobike: yobike.getBicyclesByLatLng,
            jump: jump.getBicyclesByLatLng,
            pony: pony.getBicyclesByLatLng,
            lime: lime.getBicyclesByLatLng
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
