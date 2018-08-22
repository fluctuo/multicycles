import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql'

import { tokens } from './tokens'
import { plan, planType } from './plans'
import { usage, usageType } from './usages'

import { getUsers, getUser } from '../controllers/users'
import { requireAdmin, requireUser } from '../auth'

function camelCase(s) {
  return s.replace(/_\w/g, m => m[1].toUpperCase())
}

function formatUser(user) {
  const formatedUser = {}

  for (const key in user) {
    if (user.hasOwnProperty(key)) {
      if (key === 'app_metadata' && user.app_metadata.roles) {
        formatedUser.roles = user.app_metadata.roles
      }

      formatedUser[camelCase(key)] = user[key]
    }
  }

  return formatedUser
}

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'Open-API user',
  fields: {
    createdAt: { type: GraphQLString },
    email: { type: GraphQLString },
    htmlUrl: { type: GraphQLString },
    lastIp: { type: GraphQLString },
    lastLogin: { type: GraphQLString },
    name: { type: GraphQLString },
    nickname: { type: GraphQLString },
    picture: { type: GraphQLString },
    userId: { type: GraphQLString },
    roles: { type: new GraphQLList(GraphQLString) },
    tokens: { type: tokens.type, resolve: tokens.resolve },
    plan: { type: planType, resolve: plan.resolve },
    usage: { type: usageType, resolve: usage.resolve }
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
      users: resp.users.map(u => formatUser(u))
    }))
  }
}

const me = {
  type: userType,
  description: 'Get own detail',
  async resolve(root, args, ctx) {
    requireUser(ctx.state.user)

    const user = await getUser(ctx.state.user.sub)

    return formatUser(user)
  }
}

export { users, me }
