import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql'

import Mobike from '@multicycles/mobike'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'

const client = new Mobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const MobikeType = new GraphQLObjectType({
  name: 'Mobike',
  description: 'A Mobike bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    num: { type: GraphQLInt },
    distance: { type: GraphQLString },
    bikeIds: { type: GraphQLString },
    biketype: { type: GraphQLInt },
    mobike_type: { type: GraphQLInt },
    boundary: { type: GraphQLString }
  }
})

const mobike = {
  type: new GraphQLList(MobikeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const cached = await cache.get(`mobike|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({ lat, lng })

      const formatedResult = result.body.object.map(bike => ({
        id: bike.distId,
        lat: bike.distY,
        lng: bike.distX,
        type: 'BIKE',
        attributes: bike.biketype === 2 ? ['GEARS'] : [],
        provider: Mobike.getProviderDetails(),
        num: bike.distNum,
        distance: bike.distance,
        bikeIds: bike.bikeIds,
        biketype: bike.biketype,
        mobike_type: bike.type,
        boundary: bike.boundary
      }))

      cache.set(`mobike|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'mobike' },
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

const provider = Mobike.getProviderDetails()

export { MobikeType, mobike, provider }
