import { GraphQLInterfaceType } from 'graphql'

import { NextbikeType } from './nextbike'
import { stationInterfaceType } from './vehicleDetailType'

const StationType = new GraphQLInterfaceType({
  name: 'Station',
  description: 'A station',
  fields: () => ({
    ...stationInterfaceType
  }),
  resolveType: vehicle => {
    let type

    switch (vehicle.provider.slug) {
      case 'nextbike':
        type = NextbikeType
        break
    }

    return type
  }
})

export { StationType }
