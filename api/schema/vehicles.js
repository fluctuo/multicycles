import { GraphQLInterfaceType, GraphQLNonNull, GraphQLFloat, GraphQLList } from 'graphql'
import distance from '@turf/distance'
import { point } from '@turf/helpers'

import { BykeType, byke } from './byke'
import { CallABikeType, callabike } from './callabike'
import { CityscootType, cityscoot } from './cityscoot'
import { CoupType, coup } from './coup'
import { DonkeyType, donkey } from './donkey'
import { GobeeBikeType, gobeebike } from './gobee'
import { HellobikeType, hellobike } from './hellobike'
import { IndigoWheelType, indigowheel } from './indigowheel'
import { JumpType, jump } from './jump'
import { LimeType, lime } from './lime'
import { MobikeType, mobike } from './mobike'
import { NextbikeType, nextbike } from './nextbike'
import { ObikeType, obike } from './obike'
import { OfoType, ofo } from './ofo'
import { PonyType, pony } from './pony'
import { WhiteBikesType, whitebikes } from './whitebikes'
import { YobikeType, yobike } from './yobike'
import { BirdType, bird } from './bird'
import { SpinType, spin } from './spin'
import { WindType, wind } from './wind'
import { vehicleInterfaceType } from './vehicleDetailType'

import { requireAccessToken } from '../auth'
import db from '../db'
import { getProviders } from '../citiesProviders'
import { allProviders } from '../utils'

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
      case 'callabike':
        type = CallABikeType
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
      case 'nextbike':
        type = NextbikeType
        break
      case 'hellobike':
        type = HellobikeType
        break
      case 'cityscoot':
        type = CityscootType
        break
      case 'wind':
        type = WindType
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

    const { lat, lng } = roundPosition(args)
    const availableProviders = await getProviders({ lat, lng })

    return availableProviders.length
      ? Promise.all(availableProviders.map(provider => eval(provider).resolve({ lat, lng }, args, ctx, info)))
          .then(flat)
          .then(vehicles => limitToRadius({ lat, lng }, vehicles, 400))
      : Promise.all(allProviders.map(provider => eval(provider).resolve({ lat, lng }, args, ctx, info)))
          .then(flat)
          .then(vehicles => saveCityProviders(vehicles, { lat, lng }))
          .then(vehicles => limitToRadius({ lat, lng }, vehicles, 400))
  }
}

async function saveCityProviders(vehicles, { lat, lng }) {
  await db('temp_queries').insert({
    lat,
    lng,
    providers: [...new Set(vehicles.map(v => v.provider.slug))]
  })

  return vehicles
}

function limitToRadius(center, vehicles, meters) {
  const user = point([center.lng, center.lat])

  return vehicles.filter(v => {
    const vehicle = point([v.lng, v.lat])

    return distance(user, vehicle) <= meters / 1000
  })
}

export { vehicles, VehicleType }
