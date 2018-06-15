exports.up = function(knex, Promise) {
  return knex.schema.createTable('stats', table => {
    table.increments()
    table.integer('token_id')
    table.foreign('token_id').references('tokens.id')
    table.integer('hits').defaultTo(1)
    table.date('date').defaultTo(knex.raw('now()'))
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('stats')
}
