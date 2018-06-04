import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString } from 'graphql'

import Ofo from '@multicycles/ofo'

import { BikeType } from './bikes'
import { ProviderType } from './providers'
import config from '../config'
import logger from '../logger'

const client = new Ofo({ token: config.ofoAuthToken, timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const OfoType = new GraphQLObjectType({
  name: 'Ofo',
  interfaces: () => [BikeType],
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
