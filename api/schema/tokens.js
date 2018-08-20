import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import randomstring from 'randomstring'

import { tokenStats, TokenStatsType } from './tokenStats'

import db from '../db'
import { requireScope } from '../auth'

async function generateToken() {
  let result
  let token

  while (!result || result[0].count > 0) {
    token = randomstring.generate()
    result = await db('tokens')
      .where({ value: token })
      .count()
  }

  return token
}

const tokenType = new GraphQLObjectType({
  name: 'Token',
  description: 'The token access API',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    value: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    stats: { type: new GraphQLList(TokenStatsType), resolve: tokenStats.resolve }
  }
})

function formatToken({ id, name, value, created_at }) {
  return {
    id,
    name,
    value,
    createdAt: created_at
  }
}

const tokens = {
  type: new GraphQLList(tokenType),
  description: 'Get owned access token for request Open-API',
  async resolve(root, args, ctx) {
    requireScope(ctx.state.user, 'read:tokens')

    return await db('tokens')
      .where('userId', root ? root.userId : ctx.state.user.sub)
      .orderBy('created_at')
      .then(tokens => tokens.map(formatToken))
  }
}

const createToken = {
  type: tokenType,
  args: {
    name: { type: GraphQLString }
  },
  async resolve(root, args, ctx) {
    requireScope(ctx.state.user, 'create:tokens')

    const value = await generateToken()

    return await db('tokens')
      .insert({
        value,
        name: args.name,
        userId: ctx.state.user.sub
      })
      .then(formatToken)
  }
}

const updateToken = {
  type: new GraphQLObjectType({
    name: 'UpdateToken',
    fields: {
      id: { type: GraphQLInt }
    }
  }),
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(root, args, ctx) {
    requireScope(ctx.state.user, 'update:tokens')

    await db('tokens')
      .where({
        userId: ctx.state.user.sub,
        id: args.id
      })
      .update({
        name: args.name
      })

    return {
      id: args.id
    }
  }
}

const deleteToken = {
  type: new GraphQLObjectType({
    name: 'DeleteToken',
    fields: {
      id: { type: GraphQLInt }
    }
  }),
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) }
  },
  async resolve(root, args, ctx) {
    requireScope(ctx.state.user, 'delete:tokens')

    await db('tokens')
      .where({
        userId: ctx.state.user.sub,
        id: args.id
      })
      .del()

    return {
      id: args.id
    }
  }
}

export { tokens, createToken, updateToken, deleteToken }
