import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import Byke from '@multicycles/byke'

import bicycleType from './bicycleType'
import logger from '../logger'

const byke = new Byke({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const bykeType = new GraphQLObjectType({
  name: 'Byke',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
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

const getBicyclesByLatLng = {
  type: new GraphQLList(bykeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await byke.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.body.items.map(bike => ({
        id: bike.bikeNo,
        lat: bike.latitude,
        lng: bike.longitude,
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

export default {
  getBicyclesByLatLng
}
