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
import ProviderType from './provider'

function flat(arr) {
  return arr.reduce((r, a) => [...r, ...a])
}

const BikeType = new GraphQLInterfaceType({
  name: 'Bike',
  fields: () => ({
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
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
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  resolve: (root, args) => {
    return Promise.all([
      byke.resolve(args),
      donkey.resolve(args),
      gobeebike.resolve(args),
      indigowheel.resolve(args),
      jump.resolve(args),
      lime.resolve(args),
      mobike.resolve(args),
      obike.resolve(args),
      ofo.resolve(args),
      pony.resolve(args),
      whitebikes.resolve(args),
      yobike.resolve(args)
    ]).then(flat)
  }
}

export { bikes, BikeType }
