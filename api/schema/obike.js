import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import Obike from '@multicycles/obike'

import { BikeType } from './bikes'
import { ProviderType } from './providers'
import logger from '../logger'

const client = new Obike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const ObikeType = new GraphQLObjectType({
  name: 'Obike',
  interfaces: () => [BikeType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    provider: { type: ProviderType },
    imei: { type: GraphQLString },
    iconUrl: { type: GraphQLString },
    promotionActivityType: { type: GraphQLString },
    countryId: { type: GraphQLInt },
    cityId: { type: GraphQLInt },
    helmet: { type: GraphQLInt }
  }
})

const obike = {
  type: new GraphQLList(ObikeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.body.data.list.map(bike => ({
        id: bike.id,
        lat: bike.latitude,
        lng: bike.longitude,
        provider: {
          name: 'obike'
        },
        imei: bike.imei,
        iconUrl: bike.iconUrl,
        promotionActivityType: bike.promotionActivityType,
        countryId: bike.countryId,
        cityId: bike.cityId,
        helmet: bike.helmet
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'obike' },
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

const provider = Obike.getProviderDetails()

export { ObikeType, obike, provider }
