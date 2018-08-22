import { promisify } from 'util'
import Limiter from 'ratelimiter'
import redis from './redis'
import { getLimits } from './controllers/tokens'

export default async (ctx, next) => {
  if (ctx.state.user && ctx.state.user.roles && ctx.state.user.roles.includes('admin')) {
    return await next()
  }

  const token = ctx.state.accessToken

  let limiter

  if (!token) {
    limiter = new Limiter({
      db: redis,
      duration: 60 * 1000,
      id: ctx => ctx.ip,
      max: process.env.REQS_PER_MINUTES || 10
    })
  } else {
    const { hitsPerMin } = await getLimits(token.id)

    limiter = new Limiter({
      db: redis,
      duration: 60 * 1000,
      id: token.id,
      max: hitsPerMin
    })
  }

  const get = promisify(limiter.get).bind(limiter)
  const limit = await get()

  const calls = limit.remaining > 0 ? limit.remaining - 1 : 0

  ctx.set({
    'X-RateLimit-Remaining': calls,
    'X-RateLimit-Reset': limit.reset,
    'X-RateLimit-Limit': limit.total
  })

  if (limit.remaining) {
    return await next()
  }

  const delta = (limit.reset * 1000 - Date.now()) | 0
  const after = (limit.reset - Date.now() / 1000) | 0
  ctx.set('Retry-After', after)

  ctx.status = 429
  ctx.body = `Rate limit exceeded, retry in ${ms(delta, { long: true })}.`

  ctx.throw(ctx.status, ctx.body, { headers })
}
