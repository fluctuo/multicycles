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
import GraphQLJSON from 'graphql-type-json'

import db from '../db'
import { requireScope } from '../auth'

const TokenStatsType = new GraphQLObjectType({
  name: 'TokenStats',
  fields: {
    date: { type: GraphQLDateTime },
    hits: { type: GraphQLInt }
  }
})

const tokenStats = {
  type: new GraphQLList(TokenStatsType),
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) }
  },
  async resolve(root, args, ctx) {
    if (!root || !root.id) {
      requireScope(ctx.state.user, 'read:tokens')

      const t = await db('tokens')
        .where({
          userId: ctx.state.user.sub,
          id: args.id
        })
        .first()

      if (!t || ctx.state.user.sub !== t.userId) {
        throw new Error('Not your token')
      }
    }

    const tokenId = root && root.id ? root.id : args.id
    const result = await db.raw(
      `
      SELECT
        day as "date",
        coalesce(hits, 0) as "hits"
      FROM (
        select generate_series(now() - interval '1 month', now(), interval '1 day')::date
      ) as d(day)
      LEFT JOIN (
        SELECT * FROM stats
        WHERE token_id = ?
      ) as s ON s.date::date = day
      ORDER BY day
    `,
      [tokenId]
    )

    return result.rows
  }
}

export { tokenStats, TokenStatsType }
