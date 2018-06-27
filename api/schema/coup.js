import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import Coup from '@multicycles/coup'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.data.scooters.map(vehicle => ({
    id: vehicle.id,
    lat: vehicle.location.lat,
    lng: vehicle.location.lng,
    type: 'MOTORSCOOTER',
    attributes: ['ELECTRIC'],
    provider: Coup.getProviderDetails(),
    vin: vehicle.vin,
    model: vehicle.model,
    license_plate: vehicle.license_plate,
    energy_level: vehicle.energy_level,
    distance_to_travel: vehicle.distance_to_travel
  }))
}

const client = new Coup({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const CoupType = new GraphQLObjectType({
  name: 'Coup',
  description: 'A Coup vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    vin: { type: GraphQLString },
    model: { type: GraphQLString },
    license_plate: { type: GraphQLString },
    energy_level: { type: GraphQLInt },
    distance_to_travel: { type: GraphQLFloat }
  }
})

const coup = {
  type: new GraphQLList(CoupType),
  description: 'Get Coup vehicles by postions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Coup, client, mapVehicles)
  }
}

const provider = Coup.getProviderDetails()

export { CoupType, coup, provider }
