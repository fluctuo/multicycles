import Cacheman from 'cacheman'

let config

if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  config = {
    engine: 'redis',
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
  }
}

export default new Cacheman({
  ttl: process.env.CACHE_TTL || 5 * 60,
  ...config
})
