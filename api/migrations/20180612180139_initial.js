exports.up = function(knex, Promise) {
  return knex.schema.createTable('tokens', table => {
    table.increments()
    table.string('userId')
    table.string('value')
    table.unique('value')
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tokens')
}
