'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://127.0.0.1:3000"',
  MAPBOX_KEY: '"pk.eyJ1IjoicGllcnJpY2twIiwiYSI6ImNqZGExbnhoOTB2ZHoydnBjdG1qczJmOXcifQ.LHd8zFvfEV_qPh1tcue2Nw"',
  MULTICYCLES_ACCESS_KEY: '"7dh95eB4HJRUufplAfoH2IMHASxNfkTM"'
})
