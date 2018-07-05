import ratelimit from 'koa-ratelimit'
import Redis from 'redis'

export default ratelimit({
  db: Redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }),
  duration: 60 * 1000,
  id: ctx => ctx.ip,
  max: process.env.REQS_PER_MINUTES || 60
})
