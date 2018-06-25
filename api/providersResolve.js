import { requireAccessToken } from './auth'
import logger from './logger'
import cache from './cache'

async function resolve({ lat, lng }, ctx, info, Provider, client, mapVehicles) {
  requireAccessToken(ctx.state.accessToken)

  const provider = Provider.getProviderDetails()

  try {
    const cached = await cache.get(`${provider.slug}|${lat}|${lng}`)

    if (cached) {
      return cached
    }

    const result = await client.getBicyclesByLatLng({ lat, lng })
    const formatedResult = mapVehicles(result)

    if (formatedResult.length > 0) {
      cache.set(`${provider.slug}|${lat}|${lng}`, formatedResult)
    }

    return formatedResult
  } catch (e) {
    logger.exception(e, {
      tags: { provider: `${provider.slug}` },
      extra: {
        path: info.path,
        variable: info.variableValues,
        body: ctx.req.body
      }
    })

    return []
  }
}

export default resolve
