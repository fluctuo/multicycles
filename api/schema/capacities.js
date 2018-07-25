import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql'
import MapboxClient from 'mapbox'

import { getLanguage } from '../utils'
import { getProviders } from '../citiesProviders'
import logger from '../logger'
import { requireAccessToken } from '../auth'

const mapboxClient = new MapboxClient(process.env.MAPBOX_KEY)

const capacitiesType = new GraphQLObjectType({
  name: 'Capacities',
  description: 'The available capacities',
  fields: {
    defaultLanguage: { type: GraphQLString },
    providers: { type: new GraphQLList(GraphQLString) }
  }
})

export default {
  type: capacitiesType,
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
  async resolve(root, args, ctx) {
    requireAccessToken(ctx.state.accessToken)

    let country, city

    try {
      const geocode = await mapboxClient.geocodeReverse(
        {
          latitude: args.lat,
          longitude: args.lng
        },
        {
          types: 'country,place',
          language: 'en'
        }
      )

      geocode.entity.features.forEach(ac => {
        if (ac.place_type.includes('country')) {
          country = ac.text
        }

        if (ac.place_type.includes('place')) {
          city = ac.text
        }
      })
    } catch (err) {
      logger.exception(err)
    }

    const providers = await getProviders({ lat: args.lat, lng: args.lng }, true)

    return {
      location: country ? `${city && `${city}, `}${country}` : 'unknown',
      defaultLanguage: getLanguage(country),
      providers
    }
  }
}
