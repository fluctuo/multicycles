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
      const bikeType = o.bike_list[0].bike_type
      data.attributes = []

      switch (bikeType) {
        case 30:
        case 31:
        case 33:
        case 34:
        case 35:
        case 36:
        case 38:
        case 40:
        case 42:
        case 46:
        case 47:
        case 48:
        case 53:
        case 55:
        case 56:
        case 60:
        case 63:
        case 66:
        case 67:
        case 7:
        case 8:
          data.attributes.push('CHILD_SEAT')
          break
        case 24:
        case 28:
        case 29:
        case 40:
        case 41:
        case 52:
        case 59:
        case 65:
          data.attributes.push('CARGO')
        case 6:
        case 17:
        case 19:
        case 37:
          data.attributes.push('ELECTRIC')

        case 9:
        case 18:
        case 22:
        case 23:
        case 25:
        case 26:
        case 27:
        case 39:
        case 43:
        case 49:
        case 54:
          data.attributes.push('TANDEM')
        default:
          break
      }

      if (![24, 28, 29, 40, 41, 52, 59, 65].includes(bikeType)) {
        data.attributes.push('GEARS')
      }
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
