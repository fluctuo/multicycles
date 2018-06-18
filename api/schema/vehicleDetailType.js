import { GraphQLEnumType } from 'graphql'

const VehicleTypeEnumType = new GraphQLEnumType({
  name: 'VehicleTypeEnum',
  values: {
    BIKE: { description: 'A bike, something with two wheel, a handlebar and a saddle' },
    SCOOTER: { description: 'A scooter, like a bike without saddle. ¯\\_(⊙︿⊙)_/¯' }
  }
})

const VehicleAttributeEnumType = new GraphQLEnumType({
  name: 'VehicleAttributeEnum',
  values: {
    GEARS: { description: 'This vehicle has gears' },
    ELECTRIC: { description: 'This vehicle is electric' }
  }
})

export { VehicleTypeEnumType, VehicleAttributeEnumType }
