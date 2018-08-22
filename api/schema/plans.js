import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { getPlan } from '../controllers/plans'

const planType = new GraphQLObjectType({
  name: 'Plan',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    support: { type: GraphQLString },
    limits: { type: GraphQLJSON }
  }
})

const plan = {
  type: planType,
  resolve: (root, args, ctx) => {
    return getPlan(root.planId, root.overwritedLimits)
  }
}

export { plan, planType }
