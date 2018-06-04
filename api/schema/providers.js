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

const AppType = new GraphQLObjectType({
  name: 'App',
  fields: {
    android: { type: GraphQLString },
    ios: { type: GraphQLString }
  }
})

const ProviderType = new GraphQLObjectType({
  name: 'Provider',
  fields: {
    name: { type: GraphQLString },
    website: { type: GraphQLString },
    app: { type: AppType }
  }
})

const providers = {
  type: new GraphQLList(ProviderType),
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  resolve: async (root, args) => {
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
