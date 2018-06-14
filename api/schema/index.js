import { GraphQLSchema, GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLList } from 'graphql'
import { vehicles } from './vehicles'
import { providers } from './providers'

import { byke } from './byke'
import { donkey } from './donkey'
import { gobeebike, GobeeVehicleType } from './gobee'
import { indigowheel } from './indigowheel'
import { inspect } from 'util'
import { jump } from './jump'
import { lime } from './lime'
import { mobike } from './mobike'
import { obike } from './obike'
import { ofo } from './ofo'
import { pony } from './pony'
import { whitebikes } from './whitebikes'
import { yobike } from './yobike'
import capacities from './capacities'
import { tokens, createToken, deleteToken } from './tokens'
import util from 'util'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      capacities,
      bicyclesByLatLng: {
        deprecationReason: 'Use the aggregated query "bikes"',
        type: new GraphQLObjectType({
          name: 'BicyclesByLatLng',
          fields: {
            byke,
            donkey,
            gobee: {
              type: GobeeVehicleType,
              deprecationReason: 'Renamed gobeebike',
              resolve: gobeebike.resolve
            },
            gobeebike,
            indigowheel,
            jump,
            lime,
            mobike,
            obike,
            ofo,
            pony,
            whitebikes,
            yobike
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
      },
      vehicles,
      providers,
      tokens
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createToken,
      deleteToken
    }
  })
})
