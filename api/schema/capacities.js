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

import config from '../config'
import utils from '../utils'
import logger from '../logger'

const mapboxClient = new MapboxClient(config.mapboxKey)

const capacitiesType = new GraphQLObjectType({
  name: 'Capacities',
  fields: {
    defaultLanguage: { type: GraphQLString },
    providers: { type: new GraphQLList(GraphQLString) }
  }
})

export default {
  type: capacitiesType,
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args) {
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

    return {
      location: country ? `${city && `${city}, `}${country}` : 'unknown',
      defaultLanguage: utils.getLanguage(country),
      providers: utils.getProviders(city, country, true)
    }
  }
}
