import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import Bird from '@multicycles/bird'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.birds.map(bike => ({
    id: bike.id,
    lat: bike.location.latitude,
    lng: bike.location.longitude,
    type: 'SCOOTER',
    attributes: ['ELECTRIC'],
    provider: Bird.getProviderDetails(),
    code: bike.code,
    battery_level: bike.battery_level
  }))
}

const client = new Bird({ token: process.env.BIRD_AUTH_TOKEN, timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const BirdType = new GraphQLObjectType({
  name: 'Bird',
  description: 'A Bird scooter',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    code: { type: GraphQLString },
    battery_level: { type: GraphQLInt }
  }
})

const bird = {
  type: new GraphQLList(BirdType),
  description: 'Get Bird scooters by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Bird, client, mapVehicles)
  }
}

const provider = Bird.getProviderDetails()

export { BirdType, bird, provider }
