import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLFloat,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import Nextbike from '@multicycles/nextbike'

import { VehicleType } from './vehicles'
import { StationType } from './stations'
import { vehicleInterfaceType, stationInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  let city
  body.countries.forEach(country => {
    if (country.cities.length === 1) {
      city = country.cities[0]
    }
  })

  return city.places.map(o => {
    const data = {
      id: o.uid,
      lat: o.lat,
      lng: o.lng,
      type: o.bike ? 'BIKE' : 'STATION',
      provider: Nextbike.getProviderDetails(),
      nextbike_fields: {
        bike: o.bike,
        name: o.name,
        address: o.address,
        spot: o.spot,
        number: o.number,
        bikes: o.bikes,
        bike_racks: o.bike_racks,
        free_racks: o.free_racks,
        maintenance: o.maintenance,
        terminal_type: o.terminal_type,
        bike_list: o.bike_list,
        bike_numbers: o.bike_numbers,
        bike_types: o.bike_types,
        place_type: o.place_type,
        rack_locks: o.rack_locks
      }
    }

    if (data.type === 'STATION') {
      data.available_vehicles = o.bikes
      data.available_stands = o.free_racks
      data.total_stands = o.bike_racks
    } else {
      data.attributes = []
    }

    return data
  })
}

const client = new Nextbike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const NextbikeFieldsType = new GraphQLObjectType({
  name: 'NextbikeFields',
  description: 'Specific fields for Nextbike',
  fields: {
    bike: { type: GraphQLBoolean },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    spot: { type: GraphQLBoolean },
    number: { type: GraphQLInt },
    bikes: { type: GraphQLInt },
    bike_racks: { type: GraphQLInt },
    free_racks: { type: GraphQLInt },
    maintenance: { type: GraphQLBoolean },
    terminal_type: { type: GraphQLString },
    bike_list: { type: GraphQLJSON },
    bike_numbers: { type: GraphQLJSON },
    bike_types: { type: GraphQLJSON },
    place_type: { type: GraphQLString },
    rack_locks: { type: GraphQLBoolean }
  }
})

const NextbikeType = new GraphQLObjectType({
  name: 'Nextbike',
  description: 'A Nextbike vehicle or station',
  interfaces: () => [VehicleType, StationType],
  fields: {
    ...vehicleInterfaceType,
    ...stationInterfaceType,
    nextbike_fields: { type: NextbikeFieldsType }
  }
})

const nextbike = {
  type: new GraphQLList(NextbikeType),
  description: 'Get Nextbike vehicles by postions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, Nextbike, client, mapVehicles)
  }
}

const provider = Nextbike.getProviderDetails()

export { NextbikeType, nextbike, provider }
