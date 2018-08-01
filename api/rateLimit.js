import ratelimit from 'koa-ratelimit'
import Redis from 'redis'

export default ratelimit({
  db: Redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }),
  duration: 60 * 1000,
  id: ctx => {
    // disable ratelimit for admins
    if (ctx.state.user && ctx.state.user.roles && ctx.state.user.roles.includes('admin')) {
      return Math.round(Math.random() * 10000)
    }

    return ctx.ip
  },
  max: process.env.REQS_PER_MINUTES || 60
})
