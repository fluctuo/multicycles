import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import { hitsPerMonth, tokensCount } from '../controllers/usages'

const usageType = new GraphQLObjectType({
  name: 'Usage',
  fields: {
    tokens: { type: GraphQLInt },
    hitsPerMonth: { type: GraphQLInt }
  }
})

const usage = {
  type: usageType,
  resolve: async root => {
    return {
      tokens: await tokensCount(root.userId),
      hitsPerMonth: await hitsPerMonth(root.userId)
    }
  }
}

export { usage, usageType }
