import client from 'prom-client'

client.collectDefaultMetrics({ prefix: 'api_' })

const vehiclesRequestsTotal = new client.Counter({
  name: 'api_vehicles_requests_total',
  help: 'Total of vehicles query',
  labelNames: ['provider', 'cached']
})

const vehiclesRequestsDurationSeconds = new client.Histogram({
  name: 'api_vehicles_requests_duration_seconds',
  help: 'Vehicles query duration in seconds',
  labelNames: ['provider'],
  buckets: [0.5, 1, 2, 3, 5, 5]
})

const providersRequestsTotal = new client.Counter({
  name: 'api_providers_requests_total',
  help: 'Total of providers query',
  labelNames: ['with_lat_lng']
})

export { client as default, vehiclesRequestsTotal, vehiclesRequestsDurationSeconds, providersRequestsTotal }
