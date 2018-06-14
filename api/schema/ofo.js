import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString } from 'graphql'

import Ofo from '@multicycles/ofo'

import { VehicleType } from './vehicles'
import { ProviderType } from './providers'
import logger from '../logger'

const client = new Ofo({ token: process.env.OFO_AUTH_TOKEN, timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const OfoType = new GraphQLObjectType({
  name: 'Ofo',
  description: 'A Ofo bike',
  interfaces: () => [VehicleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    provider: { type: ProviderType },
    carno: { type: GraphQLString },
    bomNum: { type: GraphQLString },
    userIdLast: { type: GraphQLString }
  }
})

const ofo = {
  type: new GraphQLList(OfoType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.body.values.cars.map(bike => ({
        id: bike.carno,
        lat: bike.lat,
        lng: bike.lng,
        provider: {
          name: 'ofo'
        },
        carno: bike.carno,
        bomNum: bike.bomNum,
        userIdLast: bike.userIdLast
      }))
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
