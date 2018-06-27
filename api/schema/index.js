import { GraphQLSchema, GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLList } from 'graphql'
import { vehicles } from './vehicles'
import { providers } from './providers'

import { byke } from './byke'
import { coup } from './coup'
import { donkey } from './donkey'
import { gobeebike } from './gobee'
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
import { bird } from './bird'
import { spin } from './spin'
import capacities from './capacities'
import { tokens, createToken, deleteToken } from './tokens'
import { tokenStats } from './tokenStats'
import util from 'util'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      /* Main */
      vehicles,
      providers,
      capacities,
      tokens,
      tokenStats,
      /* Providers */
      bird,
      byke,
      coup,
      donkey,
      gobeebike,
      indigowheel,
      jump,
      lime,
      mobike,
      obike,
      ofo,
      pony,
      spin,
      whitebikes,
      yobike
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createToken,
      deleteToken
    }
  })
})
