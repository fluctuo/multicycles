import { GraphQLObjectType, GraphQLInterfaceType, GraphQLFloat, GraphQLString } from 'graphql'

export default new GraphQLObjectType({
  name: 'ProviderType',
  fields: {
    name: { type: GraphQLString }
  }
})
