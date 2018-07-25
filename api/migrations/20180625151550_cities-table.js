exports.up = function(knex, Promise) {
  return knex.schema.createTable('cities', table => {
    table.increments()
    table.string('city')
    table.string('country')
    table.float('lat')
    table.float('lng')
    table.specificType('providers', 'text[]')
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('cities')
}
