import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import Byke from '@multicycles/byke'

import { VehicleType } from './vehicles'
import { ProviderType } from './providers'
import logger from '../logger'

const client = new Byke({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const BykeType = new GraphQLObjectType({
  name: 'Byke',
  description: 'A Byke bike',
  interfaces: () => [VehicleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    provider: { type: ProviderType },
    bikeId: { type: GraphQLString },
    VehicleType: { type: GraphQLString },
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
      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.body.items.map(bike => ({
        id: bike.bikeNo,
        lat: bike.latitude,
        lng: bike.longitude,
        provider: {
          name: 'byke'
        },
        bikeId: bike.bikeId,
        VehicleType: bike.VehicleType,
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
