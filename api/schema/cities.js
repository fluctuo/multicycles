import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import { getCities } from '../citiesProviders'
import { requireAdmin } from '../auth'

const CityType = new GraphQLObjectType({
  name: 'City',
  description: 'A city details.',
  fields: {
    id: { type: GraphQLInt },
    city: { type: GraphQLString, description: 'City name' },
    country: { type: GraphQLString, description: 'Country' },
    geojson: { type: GraphQLJSON, description: "City's geojson" },
    providers: {
      type: new GraphQLList(GraphQLString),
      description: 'List of available providers in this city'
    }
  }
})

const cities = {
  type: new GraphQLList(CityType),
  description: 'Return all cities with providers',
  resolve: async (root, args, ctx) => {
    requireAdmin(ctx.state.user)

    return await getCities().then(cities => cities.map(city => ({ ...city, geojson: JSON.parse(city.geojson) })))
  }
}

export { cities }
