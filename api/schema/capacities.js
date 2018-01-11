import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql'
import gmaps from '@google/maps'

import config from '../config'
import utils from '../utils'
import bicycleType from './bicycleType'

const gmapsClient = gmaps.createClient({
  key: config.gmapsKey,
  Promise
})

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
    const geocode = await gmapsClient
      .reverseGeocode({
        latlng: {
          lat: args.lat,
          lng: args.lng
        }
      })
      .asPromise()

    geocode.json.results.forEach(ac => {
      if (ac.types.includes('country') && ac.types.includes('political')) {
        country = ac.formatted_address
      }

      if (ac.types.includes('locality') && ac.types.includes('political')) {
        ac.address_components.forEach(c => {
          if (c.types.includes('locality') && c.types.includes('political')) {
            city = c.long_name
          }
        })
      }
    })

    return {
      defaultLanguage: utils.getLanguage(country),
      providers: utils.getProviders(city, country)
    }
  }
}
