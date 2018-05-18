import { GraphQLInterfaceType, GraphQLFloat, GraphQLString } from 'graphql'

export default new GraphQLInterfaceType({
  name: 'Bicyle',
  fields: () => ({
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat }
  })
})
