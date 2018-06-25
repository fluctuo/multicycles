import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLNonNull } from 'graphql'

import Ofo from '@multicycles/ofo'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.values.cars.map(bike => ({
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
}

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
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Ofo, client, mapVehicles)
  }
}

const provider = Ofo.getProviderDetails()

export { OfoType, ofo, provider }
