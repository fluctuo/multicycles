import { GraphQLString, GraphQLFloat, GraphQLList, GraphQLEnumType, GraphQLInt } from 'graphql'
import { ProviderType } from './providers'

const ObjectTypeEnumType = new GraphQLEnumType({
  name: 'ObjectType',
  description: 'Kind of vehicle',
  values: {
    BIKE: { description: 'A bike, something with two wheel, a handlebar and a saddle' },
    SCOOTER: { description: 'A scooter, like a bike without saddle. ¯\\_(⊙︿⊙)_/¯' },
    MOTORSCOOTER: { description: 'A motor-scooter' },
    STATION: { description: 'A station of vehicles.' }
  }
})

const VehicleAttributeEnumType = new GraphQLEnumType({
  name: 'VehicleAttribute',
  description: "All vehicle's attributes",
  values: {
    GEARS: { description: 'This vehicle has gears' },
    ELECTRIC: { description: 'This vehicle is electric' }
  }
})

const vehicleInterfaceType = {
  id: { description: 'The provider id', type: GraphQLString },
  lat: { description: "The vehicle's latitude", type: GraphQLFloat },
  lng: { description: "The vehicle's longitude", type: GraphQLFloat },
  type: { description: "The object's type", type: ObjectTypeEnumType },
  attributes: { description: "The vehicle's attributes", type: new GraphQLList(VehicleAttributeEnumType) },
  provider: { type: ProviderType }
}

const stationInterfaceType = {
  available_vehicles: { description: 'Number of available vehicles', type: GraphQLInt },
  available_stands: { description: 'Number of available free stands', type: GraphQLInt },
  total_stands: { description: 'Total of stands', type: GraphQLInt }
}

export { ObjectTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType, stationInterfaceType }
