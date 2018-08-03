import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import Hellobike from '@multicycles/hellobike'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.data.map(o => ({
    id: o.bikeNo,
    lat: o.lat,
    lng: o.lng,
    type: 'BIKE',
    attributes: o.bikeType === 2 ? ['ELECTRIC'] : [],
    provider: Hellobike.getProviderDetails(),
    hellobike_fields: { ...o }
  }))
}

const client = new Hellobike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const HellobikeFieldsType = new GraphQLObjectType({
  name: 'HellobikeFields',
  description: 'Specific fields for Hellobike',
  fields: {
    bikeNo: { type: GraphQLString },
    price: { type: GraphQLString },
    time: { type: GraphQLString },
    bikeType: { type: GraphQLInt }
  }
})

const HellobikeType = new GraphQLObjectType({
  name: 'Hellobike',
  description: 'A Hellobike vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    hellobike_fields: { type: HellobikeFieldsType }
  }
})

const hellobike = {
  type: new GraphQLList(HellobikeType),
  description: 'Get Hellobike vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Hellobike, client, mapVehicles)
  }
}

const provider = Hellobike.getProviderDetails()

export { HellobikeType, hellobike, provider }
