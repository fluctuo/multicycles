import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import Cityscoot from '@multicycles/cityscoot'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.data.scooters.map(o => {
    return {
      id: o.id,
      lat: o.latitude,
      lng: o.longitude,
      type: 'MOTORSCOOTER',
      attributes: ['ELECTRIC'],
      provider: Cityscoot.getProviderDetails(),
      cityscootFields: {
        name: o.name,
        geohash: o.geohash,
        geocoding: o.geocoding,
        battery: o.battery,
        autonomy: o.autonomy,
        plate: o.plate,
        id_availability: o.id_availability,
        number: o.number
      }
    }
  })
}

const client = new Cityscoot({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const CityscootFieldsType = new GraphQLObjectType({
  name: 'CityscootFields',
  description: 'Specific fields for Cityscoot',
  fields: {
    name: { type: GraphQLString },
    geohash: { type: GraphQLString },
    geocoding: { type: GraphQLString },
    battery: { type: GraphQLInt },
    autonomy: { type: GraphQLInt },
    plate: { type: GraphQLString },
    id_availability: { type: GraphQLInt },
    number: { type: GraphQLInt }
  }
})

const CityscootType = new GraphQLObjectType({
  name: 'Cityscoot',
  description: 'A Cityscoot vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    cityscootFields: { type: CityscootFieldsType }
  }
})

const cityscoot = {
  type: new GraphQLList(CityscootType),
  description: 'Get Cityscoot vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Cityscoot, client, mapVehicles)
  }
}

const provider = Cityscoot.getProviderDetails()

export { CityscootType, cityscoot, provider }
