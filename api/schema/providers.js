import {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import { reverseGeocode } from '../geolocation'
import { getProviders } from '../citiesProviders'
import { requireAccessToken, requireAdmin } from '../auth'
import { allProviders } from '../utils'
import { providersRequestsTotal } from '../metrics'

const OsType = new GraphQLObjectType({
  name: 'OsLink',
  fields: {
    android: { type: GraphQLString, description: 'Android link' },
    ios: { type: GraphQLString, description: 'iOs link' }
  }
})

const ProviderType = new GraphQLObjectType({
  name: 'Provider',
  description: 'A provider detail. A provider refer to a company or a service that rents vehicles.',
  fields: {
    name: { type: GraphQLString, description: 'Provider name' },
    slug: { type: GraphQLString, description: 'Provider slug, can be used as a key' },
    website: { type: GraphQLString, description: 'Main provider website' },
    discountCode: { type: GraphQLString, description: 'Discount code or link for registration or first ride' },
    app: { type: OsType, description: 'Link to mobile app' },
    deepLink: { type: OsType, description: 'Deep link to mobile app' }
  }
})

const providers = {
  type: new GraphQLList(ProviderType),
  description: 'Query capacities according to location',
  args: {
    lat: {
      description: 'The requested latitude',
      type: GraphQLFloat
    },
    lng: {
      description: 'The requested longitude',
      type: GraphQLFloat
    }
  },
  resolve: async (root, args, ctx) => {
    try {
      requireAccessToken(ctx.state.accessToken)
    } catch (accessTokenError) {
      try {
        requireAdmin(ctx.state.user)
      } catch (adminError) {
        throw accessTokenError
      }
    }

    let availableProviders = allProviders

    if (args.lat && args.lng) {
      availableProviders = await getProviders({ lat: args.lat, lng: args.lng })
    }

    providersRequestsTotal.labels([!!(args.lat && args.lng)]).inc()

    return Promise.all(availableProviders.map(p => import(`./${p}`))).then(modules =>
      modules.map(module => module.provider)
    )
  }
}

export { providers, ProviderType }
