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

function findOrCreateUser(provider_field, provider_id, profile) {
  console.log('findOrCreateUser', profile)

  return db('users')
    .where(provider_field, provider_id)
    .first()
    .then(user => {
      if (user) {
        return user
      } else {
        return api
          .createAccount({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            phone: profile.phone || '+33612345678' // fake number
          })
          .then(({ createAccount: { id } }) => {
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
