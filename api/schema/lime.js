import { GraphQLObjectType, GraphQLList, GraphQLFloat, GraphQLString, GraphQLInt } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import Lime from '@multicycles/lime'

import bicycleType from './bicycleType'
import logger from '../logger'

const lime = new Lime({
  auth: {
    token: process.env.LIME_AUTH_TOKEN,
    session: process.env.LIME_AUTH_SESSION
  },
  timeout: process.env.PROVIDER_TIMEOUT || 3000
})

const limeType = new GraphQLObjectType({
  name: 'Lime',
  interfaces: [bicycleType],
  fields: {
    id: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
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

const getBicyclesByLatLng = {
  type: new GraphQLList(limeType),
  async resolve({ lat, lng }, args, context, info) {
    try {
      const result = await lime.getBicyclesByLatLng({
        lat,
        lng
      })

      return result.data.data.attributes.nearby_locked_bikes.map(bike => ({
        id: bike.id,
        lat: bike.attributes.latitude,
        lng: bike.attributes.longitude,
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

export default {
  getBicyclesByLatLng
}
