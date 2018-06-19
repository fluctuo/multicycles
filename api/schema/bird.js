import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import Bird from '@multicycles/bird'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'

const client = new Bird({ token: process.env.BIRD_AUTH_TOKEN, timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const BirdType = new GraphQLObjectType({
  name: 'Bird',
  description: 'A Bird scooter',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    code: { type: GraphQLString },
    battery_level: { type: GraphQLInt }
  }
})

const bird = {
  type: new GraphQLList(BirdType),
  description: 'Get Bird scooters by postions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve({ lat, lng }, args, context, info) {
    try {
      const cached = await cache.get(`bird|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.body.birds.map(bike => ({
        id: bike.id,
        lat: bike.location.latitude,
        lng: bike.location.longitude,
        type: 'SCOOTER',
        attributes: ['ELECTRIC'],
        provider: Bird.getProviderDetails(),
        code: bike.code,
        battery_level: bike.battery_level
      }))

      cache.set(`bird|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'bird' },
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

const provider = Bird.getProviderDetails()

export { BirdType, bird, provider }
