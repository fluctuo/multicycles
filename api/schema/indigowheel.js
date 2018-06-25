import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import IndigoWheel from '@multicycles/indigowheel'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.data.map(bike => ({
    id: bike.plate_no,
    lat: bike.latitude,
    lng: bike.longitude,
    type: 'BIKE',
    attributes: ['GEARS'],
    provider: IndigoWheel.getProviderDetails(),
    plate_no: bike.plate_no,
    discount: bike.discount,
    outside: bike.outside
  }))
}

const client = new IndigoWheel({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const IndigoWheelType = new GraphQLObjectType({
  name: 'IndigoWheel',
  description: 'A IndigoWheel bike',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    plate_no: { type: GraphQLString },
    discount: { type: GraphQLInt },
    outside: { type: GraphQLInt }
  }
})

const indigowheel = {
  type: new GraphQLList(IndigoWheelType),
  description: 'Get Indigo Wheel bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, IndigoWheel, client, mapVehicles)
  }
}

const provider = IndigoWheel.getProviderDetails()

export { indigowheel, IndigoWheelType, provider }
