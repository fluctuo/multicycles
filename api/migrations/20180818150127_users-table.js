require('dotenv')

const { ManagementClient } = require('auth0')

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
})

function createPlansTable(knex) {
  return knex.schema.createTable('plans', table => {
    table.increments()
    table.string('name')
    table.enu('support', ['basic', 'premium'])
    table.json('limits')
    table.timestamps(false, true)
  })
}

function populatePlans(knex) {
  return knex('plans').insert([
    {
      id: 1,
      name: 'free',
      support: 'basic',
      limits: {
        tokens: 2,
        hitsPerMin: 10,
        hitsPerMonth: 6000
      }
    },
    {
      id: 2,
      name: 'enterprise-1',
      support: 'premium',
      limits: {
        tokens: 10,
        hitsPerMin: 20,
        hitsPerMonth: 50000
      }
    }
  ])
}

function createUsersTable(knex) {
  return knex.schema.createTable('users', table => {
    table.increments()
    table
      .string('user_id')
      .notNullable()
      .unique()
    table.json('overwrited_limits')
    table.integer('plan_id').defaultTo(1)
    table.foreign('plan_id').references('plans.id')
    table.timestamps(false, true)
  })
}

function populateUsersTable(knex) {
  return auth0.users.getAll({ per_page: 100 }).then(result => {
    return Promise.all(result.map(u => knex('users').insert({ user_id: u.user_id })))
  })
}

exports.up = function(knex, Promise) {
  return createPlansTable(knex)
    .then(() => populatePlans(knex))
    .then(() => createUsersTable(knex))
    .then(() => populateUsersTable(knex))
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users').then(() => knex.schema.dropTable('plans'))
}
