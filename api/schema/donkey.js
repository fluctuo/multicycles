import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import Donkey from '@multicycles/donkey'

import { BikeType } from './bikes'
import { ProviderType } from './providers'
import logger from '../logger'

const client = new Donkey({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const DonkeyType = new GraphQLObjectType({
  name: 'Donkey',
  description: 'A Donkey bike',
  interfaces: () => [BikeType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    provider: { type: ProviderType },
    name: { type: GraphQLString },
    radius: { type: GraphQLInt },
    available_bikes_count: { type: GraphQLInt },
    thumbnail_url: { type: GraphQLString },
    country_code: { type: GraphQLString },
    currency: { type: GraphQLString },
    price: { type: GraphQLJSON }
  }
})

const donkey = {
  type: new GraphQLList(DonkeyType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.body.map(bike => ({
        id: bike.id,
        lat: bike.latitude,
        lng: bike.longitude,
        provider: {
          name: 'donkey'
        },
        name: bike.name,
        radius: bike.radius,
        available_bikes_count: bike.available_bikes_count,
        thumbnail_url: bike.thumbnail_url,
        country_code: bike.country_code,
        currency: bike.currency,
        price: bike.price
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'donkey' },
        extra: {
          path: info.path,
          variable: info.variableValues,
          body: context.req.body
        }
      })

      return []
    }
  }
}

const provider = Donkey.getProviderDetails()

export { DonkeyType, donkey, provider }
