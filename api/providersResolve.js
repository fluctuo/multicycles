import { requireAccessToken, requireAdmin } from './auth'
import logger from './logger'
import cache from './cache'

async function resolve({ lat, lng }, ctx, info, Provider, client, mapVehicles) {
  try {
    requireAccessToken(ctx.state.accessToken)
  } catch (accessTokenError) {
    try {
      requireAdmin(ctx.state.user)
    } catch (adminError) {
      throw accessTokenError
    }
  }

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
    // Generic soft error for not covered area
    if (e.message === 'Not Covered') {
      return []
    }

    // For Spin
    if (e.response && e.response.body && e.response.body.error === 'This region is not enabled') {
      return []
    }

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
