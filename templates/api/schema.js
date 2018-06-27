import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'

import {{ properCase provider}} from '@multicycles/{{ totalyLower provider}}'

import { VehicleType } from './vehicles'
import { vehicleInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return // @TODO map results
}

const client = new {{ properCase provider}}({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const {{ properCase provider}}Type = new GraphQLObjectType({
  name: '{{ properCase provider}}',
  description: 'A {{ properCase provider}} vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    // @TODO Add custom types
  }
})

const {{ totalyLower provider}} = {
  type: new GraphQLList({{ properCase provider}}Type),
  description: 'Get {{ properCase provider}} vehicles by postions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, {{ properCase provider}}, client, mapVehicles)
  }
}

const provider = {{ properCase provider}}.getProviderDetails()

export { {{ properCase provider}}Type, {{ totalyLower provider}}, provider }
