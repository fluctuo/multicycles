export default {
  ofoAuthToken: process.env.OFO_AUTH_TOKEN,
  mapboxKey: process.env.MAPBOX_KEY,
  logger: process.env.SENTRY_KEY,
  database: {
    // @TODO
    host: '127.0.0.1',
    user: 'postgres',
    password: 'postgres',
    database: 'multicycles'
  }
}
