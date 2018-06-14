import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import randomstring from 'randomstring'

import utils from '../utils'
import logger from '../logger'
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
    value: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime }
  }
})

function formatToken({ id, value, created_at }) {
  return {
    id,
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
      .where('userId', ctx.state.user.sub)
      .then(tokens => tokens.map(formatToken))
  }
}

const createToken = {
  type: tokenType,
  async resolve(root, args, ctx) {
    requireScope(ctx.state.user, 'create:tokens')

    const value = await generateToken()

    return await db('tokens')
      .insert({
        userId: ctx.state.user.sub,
        value
      })
      .then(formatToken)
  }
}

const deleteToken = {
  type: new GraphQLObjectType({
    name: 'DeletedToken',
    fields: {
      id: { type: GraphQLInt }
    }
  }),
  args: {
    id: { type: GraphQLInt }
  },
  async resolve(root, args, ctx) {
    requireScope(ctx.state.user, 'remove:tokens')

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

export { tokens, createToken, deleteToken }
