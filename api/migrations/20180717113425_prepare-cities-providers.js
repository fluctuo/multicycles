function createCitiesTable(knex) {
  return knex.schema.createTable('cities', table => {
    table.increments()
    table.string('city').notNullable()
    table.string('country').notNullable()
    table.specificType('bbox', 'GEOMETRY(POLYGON)').notNullable()
    table.specificType('providers', 'text[]').notNullable()
    table.timestamps(false, true)
  })
}

function createTempQueries(knex) {
  return knex.schema.createTable('temp_queries', table => {
    table.increments()
    table.float('lat').notNullable()
    table.float('lng').notNullable()
    table.specificType('providers', 'text[]').notNullable()
    table.timestamps(false, true)
  })
}

exports.up = function(knex, Promise) {
  return knex.schema
    .renameTable('cities', 'cities_temp')
    .then(() => createCitiesTable(knex))
    .then(() => createTempQueries(knex))
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('cities')
    .then(() => knex.schema.renameTable('cities_temp', 'cities'))
    .then(() => knex.schema.dropTable('temp_queries'))
}
