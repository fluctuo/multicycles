import { GraphQLInterfaceType } from 'graphql'

import { CallABikeType } from './callabike'
import { DonkeyType } from './donkey'
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
      case 'callabike':
        type = CallABikeType
        break
      case 'donkey':
        type = DonkeyType
        break
      case 'nextbike':
        type = NextbikeType
        break
    }

    return type
  }
})

export { StationType }
