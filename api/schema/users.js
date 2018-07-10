import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql'

import { tokens } from './tokens'

import { getUsers } from '../auth0'
import { requireAdmin } from '../auth'

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'Open-API user',
  fields: {
    created_at: { type: GraphQLString },
    email: { type: GraphQLString },
    html_url: { type: GraphQLString },
    last_ip: { type: GraphQLString },
    last_login: { type: GraphQLString },
    name: { type: GraphQLString },
    nickname: { type: GraphQLString },
    picture: { type: GraphQLString },
    user_id: { type: GraphQLString },
    tokens: { type: tokens.type, resolve: tokens.resolve }
  }
})

const users = {
  type: new GraphQLObjectType({
    name: 'Users',
    fields: {
      page: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      total: { type: GraphQLInt },
      users: { type: new GraphQLList(userType) }
    }
  }),
  description: 'Get all Open-API users',
  args: {
    page: {
      description: 'The page number. First is 1.',
      type: GraphQLInt
    }
  },
  async resolve(root, args, ctx) {
    requireAdmin(ctx.state.user)
    const page = args.page ? args.page - 1 : 0

    return await getUsers({
      per_page: 10,
      page,
      sort: 'created_at:-1',
      include_totals: true
    }).then(resp => ({
      page: page + 1,
      limit: resp.limit,
      total: resp.total,
      users: resp.users
    }))
  }
}

export { users }
