import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'

import IndigoWheel from '@multicycles/indigowheel'

import { VehicleType } from './vehicles'
import { ProviderType } from './providers'
import logger from '../logger'

const client = new IndigoWheel({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const IndigoWheelType = new GraphQLObjectType({
  name: 'IndigoWheel',
  description: 'A IndigoWheel bike',
  interfaces: () => [VehicleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    provider: { type: ProviderType },
    plate_no: { type: GraphQLString },
    discount: { type: GraphQLInt },
    outside: { type: GraphQLInt }
  }
})

const indigowheel = {
  type: new GraphQLList(IndigoWheelType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.body.data.map(bike => ({
        id: bike.plate_no,
        lat: bike.latitude,
        lng: bike.longitude,
        provider: {
          name: 'indigoWheel'
        },
        plate_no: bike.plate_no,
        discount: bike.discount,
        outside: bike.outside
      }))
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'indigowheel' },
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

const provider = IndigoWheel.getProviderDetails()

export { indigowheel, IndigoWheelType, provider }
