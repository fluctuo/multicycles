import { GraphQLSchema, GraphQLObjectType, GraphQLFloat, GraphQLNonNull, GraphQLList } from 'graphql'
import { vehicles } from './vehicles'
import { providers } from './providers'

import { byke } from './byke'
import { coup } from './coup'
import { donkey } from './donkey'
import { gobeebike } from './gobee'
import { hellobike } from './hellobike'
import { indigowheel } from './indigowheel'
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
import { nextbike } from './nextbike'
import capacities from './capacities'
import { tokens, createToken, deleteToken } from './tokens'
import { tokenStats } from './tokenStats'
import { users } from './users'
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
      users,
      /* Providers */
      bird,
      byke,
      coup,
      donkey,
      gobeebike,
      hellobike,
      indigowheel,
      jump,
      lime,
      mobike,
      nextbike,
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
