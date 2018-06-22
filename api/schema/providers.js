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

const AppLinkType = new GraphQLObjectType({
  name: 'AppLink',
  fields: {
    android: { type: GraphQLString, description: 'Android app link' },
    ios: { type: GraphQLString, description: 'iOs app link' }
  }
})

const ProviderType = new GraphQLObjectType({
  name: 'Provider',
  description: 'A provider detail. A provider refer to a company or a service that rents vehicles.',
  fields: {
    name: { type: GraphQLString, description: 'Provider name' },
    slug: { type: GraphQLString, description: 'Provider slug, can be used as a key' },
    website: { type: GraphQLString, description: 'Main provider website' },
    app: { type: AppLinkType, description: 'Link to mobile app' }
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
