import { GraphQLInterfaceType, GraphQLFloat } from 'graphql'

export default new GraphQLInterfaceType({
  name: 'Bicyle',
  fields: () => ({
    lat: {
      type: GraphQLFloat
    },
    lng: {
      type: GraphQLFloat
    }
  })
})
