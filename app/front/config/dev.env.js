'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://127.0.0.1:3001"',
  UA_ANALYTICS: false,
  MAPBOX_KEY: '"pk.eyJ1IjoicGllcnJpY2twIiwiYSI6ImNqZGExbnhoOTB2ZHoydnBjdG1qczJmOXcifQ.LHd8zFvfEV_qPh1tcue2Nw"',
  SENTRY_KEY: false
})
