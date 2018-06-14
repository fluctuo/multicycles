import {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import { reverseGeocode } from '../geolocation'
import utils from '../utils'
import { requireAccessToken } from '../auth'

const AppType = new GraphQLObjectType({
  name: 'App',
  fields: {
    android: { type: GraphQLString },
    ios: { type: GraphQLString }
  }
})

const ProviderType = new GraphQLObjectType({
  name: 'Provider',
  description: 'A provider detail. A provider refer to a company or a service that rents vehicles.',
  fields: {
    name: { type: GraphQLString },
    website: { type: GraphQLString },
    app: { type: AppType }
  }
})

const providers = {
  type: new GraphQLList(ProviderType),
  description: 'Query capacities according to location',
  args: {
    lat: {
      description: 'The requested latitude',
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      description: 'The requested longitude',
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  resolve: async (root, args, ctx) => {
    requireAccessToken(ctx.state.accessToken)

    const { city, country } = await reverseGeocode({
      lat: args.lat,
      lng: args.lng
    })

    const availableProviders = utils.getProviders(city, country)

    return Promise.all(availableProviders.map(p => import(`./${p}`))).then(modules =>
      modules.map(module => module.provider)
    )
  }
}

export { providers, ProviderType }
