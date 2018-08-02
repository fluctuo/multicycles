import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import db from '../db'
import { getCities } from '../citiesProviders'
import { requireAdmin } from '../auth'
import { allProviders } from '../utils'

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

const updateCity = {
  type: CityType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    providers: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
  },
  async resolve(root, args, ctx) {
    requireAdmin(ctx.state.user)

    args.providers.forEach(provider => {
      if (!allProviders.includes(provider)) {
        throw new Error('Unknown provider')
      }
    })

    return await db('cities')
      .where({ id: args.id })
      .update({
        providers: args.providers
      })
      .returning('*')
      .get(0)
  }
}

export { cities, updateCity }
