import db from './db'

export default async (ctx, next) => {
  if (ctx.query.access_token) {
    const date = new Date().toISOString().substr(0, 10)
    const accessToken = await db('tokens')
      .where({ value: ctx.query.access_token })
      .first()

    if (accessToken) {
      const query = db('stats').insert({ token_id: accessToken.id })
      await db.raw(
        '? ON CONFLICT ON CONSTRAINT stats_token_id_date_unique DO UPDATE SET hits = stats.hits + 1 WHERE stats.token_id = ? AND stats.date =  ?;',
        [query, accessToken.id, date]
      )

      ctx.state.accessToken = accessToken
    }
  }

  await next()
}
