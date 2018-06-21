import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import Lime from '@multicycles/lime'

import { VehicleType } from './vehicles'
import { VehicleTypeEnumType, VehicleAttributeEnumType, vehicleInterfaceType } from './vehicleDetailType'
import { ProviderType } from './providers'
import logger from '../logger'
import cache from '../cache'

function getAttributes(attrs) {
  const attributes = []

  if (attributes.type_name === 'electric' || attributes.type_name === 'manual') {
    attributes.push('GEARS')
  }

  if (attrs.type_name === 'scooter' || attrs.type_name === 'electric') {
    attributes.push('ELECTRIC')
  }

  return attributes
}

const client = new Lime({
  auth: {
    token: process.env.LIME_AUTH_TOKEN,
    session: process.env.LIME_AUTH_SESSION
  },
  timeout: process.env.PROVIDER_TIMEOUT || 3000
})

const LimeType = new GraphQLObjectType({
  name: 'Lime',
  description: 'A Lime vehicle',
  interfaces: () => [VehicleType],
  fields: {
    ...vehicleInterfaceType,
    status: { type: GraphQLString },
    plate_number: { type: GraphQLString },
    last_activity_at: { type: GraphQLString },
    bike_icon: { type: GraphQLJSON },
    type_name: { type: GraphQLString },
    battery_level: { type: GraphQLString },
    meter_range: { type: GraphQLInt },
    rate_plan: { type: GraphQLString },
    rate_plan_short: { type: GraphQLString },
    bike_icon_id: { type: GraphQLInt },
    last_three: { type: GraphQLString }
  }
})

const lime = {
  type: new GraphQLList(LimeType),
  description: 'Get Byke bikes by position',
  args: {
    lat: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    lng: {
      type: new GraphQLNonNull(GraphQLFloat)
    }
  },
  async resolve(root, { lat, lng }, context, info) {
    try {
      const cached = await cache.get(`lime|${lat}|${lng}`)

      if (cached) {
        return cached
      }

      const result = await client.getBicyclesByLatLng({
        lat,
        lng
      })

      const formatedResult = result.body.data.attributes.nearby_locked_bikes.map(bike => ({
        id: bike.id,
        lat: bike.attributes.latitude,
        lng: bike.attributes.longitude,
        type: bike.attributes.type_name === 'scooter' ? 'SCOOTER' : 'BIKE',
        attributes: getAttributes(bike.attributes),
        provider: Lime.getProviderDetails(),
        status: bike.attributes.status,
        plate_number: bike.attributes.plate_number,
        last_activity_at: bike.attributes.last_activity_at,
        bike_icon: bike.attributes.bike_icon,
        type_name: bike.attributes.type_name,
        battery_level: bike.attributes.battery_level,
        meter_range: bike.attributes.meter_range,
        rate_plan: bike.attributes.rate_plan,
        rate_plan_short: bike.attributes.rate_plan_short,
        bike_icon_id: bike.attributes.bike_icon_id,
        last_three: bike.attributes.last_three
      }))

      cache.set(`lime|${lat}|${lng}`, formatedResult)
      return formatedResult
    } catch (e) {
      logger.exception(e, {
        tags: { provider: 'lime' },
        extra: {
          path: info.path,
          variable: info.variableValues,
          body: context.req.body
        }
      })

      return []
    }
  }
}

const provider = Lime.getProviderDetails()

export { LimeType, lime, provider }
