exports.up = function(knex, Promise) {
  return knex.schema
    .alterTable('tokens', table => {
      table
        .string('name', 64)
        .notNull()
        .defaultTo('Default token')
    })
    .then(() => knex('tokens').update({ name: 'Default token' }))
}

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('tokens', table => {
    table.dropColumn('name')
  })
}
