const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'multicycles-app'
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations')
  }
}
