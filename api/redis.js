import Redis from 'redis'

export default Redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
