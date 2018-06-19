import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import Byke from '@multicycles/byke'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'

import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'

const client = new Byke({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const BykeType = new GraphQLObjectType({
  name: 'Byke',
  description: 'A Byke bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    bikeId: { type: GraphQLString },
    bikeType: { type: GraphQLString },
    bikeNo: { type: GraphQLString },
    lockType: { type: GraphQLString },
    pricingUnit: { type: GraphQLInt },
    pricingAmount: { type: GraphQLInt },
    currentRideId: { type: GraphQLString },
    vol: { type: GraphQLString },
    status: { type: GraphQLInt },
    isLocked: { type: GraphQLInt },
    isReadyForRiding: { type: GraphQLInt }
  }
})

const byke = {
  type: new GraphQLList(BykeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const cached = await cache.get(`byke|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.body.items.map(bike => ({
        id: bike.bikeNo,
        lat: bike.latitude,
        lng: bike.longitude,
        type: 'BIKE',
        attributes: ['GEARS'],
        provider: Byke.getProviderDetails(),
        bikeId: bike.bikeId,
        bikeType: bike.bikeType,
        bikeNo: bike.bikeNo,
        lockType: bike.lockType,
        pricingUnit: bike.pricingUnit,
        pricingAmount: bike.pricingAmount,
        currentRideId: bike.currentRideId,
        vol: bike.vol,
        status: bike.status,
        isLocked: bike.isLocked,
        isReadyForRiding: bike.isReadyForRiding
      }))

      cache.set(`byke|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'byke' },
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

const provider = Byke.getProviderDetails()

export { BykeType, byke, provider }
