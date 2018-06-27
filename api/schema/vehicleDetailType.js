import { GraphQLString, GraphQLFloat, GraphQLList, GraphQLEnumType } from 'graphql'
import { ProviderType } from './providers'

const VehicleTypeEnumType = new GraphQLEnumType({
  name: 'VehicleType',
  description: 'Kind of vehicle',
  values: {
    BIKE: { description: 'A bike, something with two wheel, a handlebar and a saddle' },
    SCOOTER: { description: 'A scooter, like a bike without saddle. ¯\\_(⊙︿⊙)_/¯' },
    MOTORSCOOTER: { description: 'A motor-scooter' }
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
  type: { description: "The vehicle's type", type: VehicleTypeEnumType },
  attributes: { description: "The vehicle's attributes", type: new GraphQLList(VehicleAttributeEnumType) },
  provider: { type: ProviderType }
}

export { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType }
