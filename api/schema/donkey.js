import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import Donkey from '@multicycles/donkey'

import { VehicleType } from './vehicles'
import { StationType } from './stations'
import { vehicleInterfaceType, stationInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.map(bike => {
    const data = {
      id: bike.id,
      lat: bike.latitude,
      lng: bike.longitude,
      provider: Donkey.getProviderDetails(),
      donkeyFields: {
        name: bike.name,
        radius: bike.radius,
        available_bikes_count: bike.available_bikes_count,
        thumbnail_url: bike.thumbnail_url,
        country_code: bike.country_code,
        currency: bike.currency,
        price: bike.price
      }
    }

    if (bike.available_bikes_count > 1) {
      data.type = 'STATION'
      data.isVirtual = true
      data.virtualRadius = bike.radius
      data.availableVehicles = bike.available_bikes_count
    } else {
      data.type = 'BIKE'
      data.attributes = ['GEARS']
    }

    return data
  })
}

const client = new Donkey({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const DonkeyFieldsType = new GraphQLObjectType({
  name: 'DonkeyFields',
  description: 'Specific fields for Donkey Republic',
  fields: {
    name: { type: GraphQLString },
    radius: { type: GraphQLInt },
    available_bikes_count: { type: GraphQLInt },
    thumbnail_url: { type: GraphQLString },
    country_code: { type: GraphQLString },
    currency: { type: GraphQLString },
    price: { type: GraphQLJSON }
  }
})

const DonkeyType = new GraphQLObjectType({
  name: 'Donkey',
  description: 'A Donkey bike',
  interfaces: () => [VehicleType, StationType],
  fields: {
    ...vehicleInterfaceType,
    ...stationInterfaceType,
    donkeyFields: { type: DonkeyFieldsType }
  }
})

const donkey = {
  type: new GraphQLList(DonkeyType),
  description: 'Get Donkey bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Donkey, client, mapVehicles)
  }
}

const provider = Donkey.getProviderDetails()

export { DonkeyType, donkey, provider }
