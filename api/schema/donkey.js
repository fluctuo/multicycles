import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import Donkey from '@multicycles/donkey'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'

const client = new Donkey({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const DonkeyType = new GraphQLObjectType({
  name: 'Donkey',
  description: 'A Donkey bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
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
      const cached = await cache.get(`donkey|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.body.map(bike => ({
        id: bike.id,
        lat: bike.latitude,
        lng: bike.longitude,
        type: 'BIKE',
        attributes: ['GEARS'],
        provider: Donkey.getProviderDetails(),
        name: bike.name,
        radius: bike.radius,
        available_bikes_count: bike.available_bikes_count,
        thumbnail_url: bike.thumbnail_url,
        country_code: bike.country_code,
        currency: bike.currency,
        price: bike.price
      }))

      cache.set(`donkey|${lat}|${lng}`, formatedResult)
      return formatedResult
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
