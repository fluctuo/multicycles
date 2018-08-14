exports.up = function(knex, Promise) {
  return knex
    .raw(
      `
    DELETE FROM stats
    WHERE id IN (
      SELECT id
      FROM (
        SELECT id,
        ROW_NUMBER() OVER (partition BY token_id, date ORDER BY id) AS rnum
        FROM stats
      ) t
      WHERE t.rnum > 1
    );
  `
    )
    .then(() =>
      knex.schema.alterTable('stats', table => {
        table
          .integer('token_id')
          .notNull()
          .alter()
        table.unique(['token_id', 'date'])
      })
    )
}

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('stats', table => {
    table.integer('token_id').alter()
    table.dropUnique(['token_id', 'date'])
  })
}
