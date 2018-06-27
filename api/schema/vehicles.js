import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType
} from 'graphql'

import { BykeType, byke } from './byke'
import { CoupType, coup } from './coup'
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
import { BirdType, bird } from './bird'
import { SpinType, spin } from './spin'
import { ProviderType } from './providers'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'

import { requireAccessToken } from '../auth'
import { reverseGeocode } from '../geolocation'
import db from '../db'
import utils from '../utils'

function flat(arr) {
  return arr.reduce((r, a) => [...r, ...a])
}

function roundPosition({ lat, lng }) {
  return {
    lat: Math.round(lat * 1000) / 1000,
    lng: Math.round(lng * 1000) / 1000
  }
}

const VehicleType = new GraphQLInterfaceType({
  name: 'Vehicle',
  description: 'A geolocated bike or vehicle',
  fields: () => ({
    ...vehicleInterfaceType
  }),
  resolveType: vehicle => {
    let type

    switch (vehicle.provider.slug) {
      case 'byke':
        type = BykeType
        break
      case 'donkey':
        type = DonkeyType
        break
      case 'gobeebike':
        type = GobeebikeType
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
      case 'bird':
        type = BirdType
        break
      case 'spin':
        type = SpinType
        break
      case 'coup':
        type = CoupType
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
  resolve: async (root, args, ctx, info) => {
    requireAccessToken(ctx.state.accessToken)

    const { city, country } = await reverseGeocode({
      lat: args.lat,
      lng: args.lng
    })

    const availableProviders = utils.getProviders(city, country, true)
    const { lat, lng } = roundPosition(args)

    return availableProviders.length
      ? Promise.all(availableProviders.map(provider => eval(provider).resolve({ lat, lng }, args, ctx, info)))
          .then(flat)
          .then(vehicles => saveCityProviders(vehicles, { city, country }, { lat, lng }))
      : []
  }
}

async function saveCityProviders(vehicles, { city, country }, { lat, lng }) {
  await db('cities').insert({
    city,
    country,
    lat,
    lng,
    providers: [...new Set(vehicles.map(v => v.provider.slug))]
  })

  return vehicles
}

export { vehicles, VehicleType }
