import { GraphQLInterfaceType } from 'graphql'

import { CallABikeType } from './callabike'
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
      case 'callabike':
        type = CallABikeType
        break
    }

    return type
  }
})

export { StationType }
