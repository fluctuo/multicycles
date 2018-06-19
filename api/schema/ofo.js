import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLNonNull } from 'graphql'

import Ofo from '@multicycles/ofo'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'

const client = new Ofo({ token: process.env.OFO_AUTH_TOKEN, timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const OfoType = new GraphQLObjectType({
  name: 'Ofo',
  description: 'A Ofo bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    carno: { type: GraphQLString },
    bomNum: { type: GraphQLString },
    userIdLast: { type: GraphQLString }
  }
})

const ofo = {
  type: new GraphQLList(OfoType),
  description: 'Get Ofo bikes by position',
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
      const cached = await cache.get(`ofo|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.body.values.cars.map(bike => ({
        id: bike.carno,
        lat: bike.lat,
        lng: bike.lng,
        type: 'BIKE',
        attributes: ['GEARS'],
        provider: Ofo.getProviderDetails(),
        carno: bike.carno,
        bomNum: bike.bomNum,
        userIdLast: bike.userIdLast
      }))

      cache.set(`ofo|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'ofo' },
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

const provider = Ofo.getProviderDetails()

export { OfoType, ofo, provider }
