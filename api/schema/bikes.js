import { GraphQLInterfaceType, GraphQLNonNull, GraphQLFloat, GraphQLString, GraphQLList } from 'graphql'

import { BykeType, byke } from './byke'
import { DonkeyType, donkey } from './donkey'
import { GobeeBikeType, gobeebike } from './gobee'
import { IndigoWheelType, indigowheel } from './indigowheel'
import { JumpType, jump } from './jump'
import { LimeType, lime } from './lime'
import { MobikeType, mobike } from './mobike'
import { ObikeType, obike } from './obike'
import { OfoType, ofo } from './ofo'
import { PonyType, pony } from './pony'
import { WhiteBikesType, whitebikes } from './whitebikes'
import { YobikeType, yobike } from './yobike'
import { ProviderType } from './providers'

import { reverseGeocode } from '../geolocation'
import utils from '../utils'

function flat(arr) {
  return arr.reduce((r, a) => [...r, ...a])
}

const BikeType = new GraphQLInterfaceType({
  name: 'Bike',
  description: 'A geolocated bike or vehicle',
  fields: () => ({
    id: { description: 'The provider id', type: GraphQLString },
    lat: { description: "The bike's latitude", type: GraphQLFloat },
    lng: { description: "The bike's longitude", type: GraphQLFloat },
    provider: { type: ProviderType }
  }),
  resolveType: bike => {
    let type

    switch (bike.provider.name) {
      case 'byke':
        type = BykeType
        break
      case 'donkey':
        type = DonkeyType
        break
      case 'gobeebike':
        type = GobeeBikeType
        break
      case 'indigowheel':
        type = IndigoWheelType
        break
      case 'jump':
        type = JumpType
        break
      case 'lime':
        type = LimeType
        break
      case 'mobike':
        type = MobikeType
        break
      case 'obike':
        type = ObikeType
        break
      case 'ofo':
        type = OfoType
        break
      case 'pony':
        type = PonyType
        break
      case 'whitebikes':
        type = WhiteBikesType
        break
      case 'yobike':
        type = YobikeType
        break
    }

    return type
  }
})

const bikes = {
  type: new GraphQLList(BikeType),
  description: 'Query available bikes according to location',
  args: {
    lat: {
      description: 'The requested latitude',
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      description: 'The requested longitude',
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  resolve: async (root, args) => {
    const { city, country } = await reverseGeocode({
      lat: args.lat,
      lng: args.lng
    })

    const availableProviders = utils.getProviders(city, country)

    return Promise.all(availableProviders.map(provider => eval(provider).resolve(args))).then(flat)
  }
}

export { bikes, BikeType }
