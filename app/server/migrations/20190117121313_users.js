exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments()
    table.string('account_id')
    table.string('google_id')
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
