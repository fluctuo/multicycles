import { GraphQLInterfaceType, GraphQLNonNull, GraphQLFloat, GraphQLString, GraphQLList } from 'graphql'

import { BykeType, byke } from './byke'
import { DonkeyType, donkey } from './donkey'
import { GobeeVehicleType, gobeebike } from './gobee'
import { IndigoWheelType, indigowheel } from './indigowheel'
import { JumpType, jump } from './jump'
import { LimeType, lime } from './lime'
import { MoVehicleType, mobike } from './mobike'
import { OVehicleType, obike } from './obike'
import { OfoType, ofo } from './ofo'
import { PonyType, pony } from './pony'
import { WhiteBikesType, whitebikes } from './whitebikes'
import { YoVehicleType, yobike } from './yobike'
import { ProviderType } from './providers'

import { reverseGeocode } from '../geolocation'
import utils from '../utils'
import { requireAccessToken } from '../auth'

function flat(arr) {
  return arr.reduce((r, a) => [...r, ...a])
}

const VehicleType = new GraphQLInterfaceType({
  name: 'Vehicle',
  description: 'A geolocated bike or vehicle',
  fields: () => ({
    id: { description: 'The provider id', type: GraphQLString },
    lat: { description: "The vehicle's latitude", type: GraphQLFloat },
    lng: { description: "The vehicle's longitude", type: GraphQLFloat },
    provider: { type: ProviderType }
  }),
  resolveType: vehicle => {
    let type

    switch (vehicle.provider.name) {
      case 'byke':
        type = BykeType
        break
      case 'donkey':
        type = DonkeyType
        break
      case 'gobeebike':
        type = GobeeVehicleType
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
        type = MoVehicleType
        break
      case 'obike':
        type = OVehicleType
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
        type = YoVehicleType
        break
    }

    return type
  }
})

const vehicles = {
  type: new GraphQLList(VehicleType),
  description: 'Query available vehicles according to location',
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
  resolve: async (root, args, ctx) => {
    requireAccessToken(ctx.state.accessToken)

    const { city, country } = await reverseGeocode({
      lat: args.lat,
      lng: args.lng
    })

    const availableProviders = utils.getProviders(city, country)

    return Promise.all(availableProviders.map(provider => eval(provider).resolve(args))).then(flat)
  }
}

export { vehicles, VehicleType }
