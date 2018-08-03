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

import CallABike from '@multicycles/callabike'

import { VehicleType } from './vehicles'
import { StationType } from './stations'
import { vehicleInterfaceType, stationInterfaceType } from './vehicleDetailType'
import resolve from '../providersResolve'

function mapVehicles({ body }) {
  return body.result.data.Locations.map(o => {
    const data = {
      id: o.objectId,
      lat: o.Position.Latitude,
      lng: o.Position.Longitude,
      provider: CallABike.getProviderDetails(),
      callabike_fields: {
        position: o.Position,
        description: o.Description,
        distance: o.Distance,
        isOutside: o.isOutside,
        virtStationRadius: o.virtStationRadius,
        objectId: o.objectId,
        objectName: o.objectName,
        isStation: o.isStation,
        isPedelec: o.isPedelec,
        totalVehicles: o.totalVehicles,
        markenName: o.markenName,
        city: o.city,
        freeBikes: o.FreeBikes
      }
    }

    if (o.isStation) {
      // Classic station
      if (o.maxSlots) {
        data.type = 'STATION'
      } else {
        // Virtual station, set as BIKE if only one bike available
        data.type = o.totalVehicles === 1 ? 'BIKE' : 'STATION'
      }
    } else {
      data.type = 'BIKE'
    }

    if (data.type === 'STATION') {
      data.available_vehicles = o.totalVehicles
      data.available_stands = o.maxSlots ? o.maxSlots - o.totalVehicles : undefined
      data.total_stands = o.maxSlots
      data.isVirtual = true
      data.virtualRadius = o.virtStationRadius
    } else {
      data.attributes = o.isPedelec ? ['ELECTRIC'] : ['GEARS']
    }

    return data
  })
}

const client = new CallABike({ timeout: process.env.PROVIDER_TIMEOUT || 3000 })

const CallABikeFieldsType = new GraphQLObjectType({
  name: 'CallABikeFields',
  description: 'Specific fields for Call a Bike',
  fields: {
    position: { type: GraphQLJSON },
    description: { type: GraphQLString },
    distance: { type: GraphQLString },
    isOutside: { type: GraphQLBoolean },
    virtStationRadius: { type: GraphQLInt },
    objectId: { type: GraphQLInt },
    objectName: { type: GraphQLString },
    isStation: { type: GraphQLBoolean },
    isPedelec: { type: GraphQLBoolean },
    totalVehicles: { type: GraphQLInt },
    markenName: { type: GraphQLString },
    city: { type: GraphQLString },
    freeBikes: { type: GraphQLJSON }
  }
})

const CallABikeType = new GraphQLObjectType({
  name: 'CallABike',
  description: 'A Call a Bike vehicle',
  interfaces: () => [VehicleType, StationType],
  fields: {
    ...vehicleInterfaceType,
    ...stationInterfaceType,
    callabike_fields: { type: CallABikeFieldsType }
  }
})

const callabike = {
  type: new GraphQLList(CallABikeType),
  description: 'Get Call a Bike vehicles by positions',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, args, ctx, info) {
    return resolve(args, ctx, info, CallABike, client, mapVehicles)
  }
}

const provider = CallABike.getProviderDetails()

export { CallABikeType, callabike, provider }
