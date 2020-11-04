const knex = require('knex')
const api = require('./api')

knex.debug = true

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'multicycles-app'
  }
})

function findById(id) {
  return db('users')
    .where({ id })
    .first()
}

function findOrCreateUser(provider_field, provider_id) {
  return db('users')
    .where(provider_field, provider_id)
    .first()
    .then(user => {
      if (user) {
        return user
      } else {
        return api.createAccount().then(({ createAccount: { id } }) => {
          return db('users')
            .insert({ account_id: id, [provider_field]: provider_id })
            .returning('*')
            .then(rows => rows[0])
        })
      }
    })
}

module.exports = {
  findById,
  findOrCreateUser
}
