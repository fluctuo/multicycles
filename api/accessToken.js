import db from './db'

export default async (ctx, next) => {
  if (ctx.query.access_token) {
    const accessToken = await db('tokens')
      .where({ value: ctx.query.access_token })
      .first()

    if (accessToken) {
      const stats = await db('stats')
        .where({
          token_id: accessToken.id,
          date: new Date().toISOString().substr(0, 10)
        })
        .first()

      if (stats) {
        await db('stats')
          .where({
            token_id: accessToken.id,
            date: new Date().toISOString().substr(0, 10)
          })
          .increment('hits', 1)
      } else {
        await db('stats').insert({ token_id: accessToken.id })
      }

      ctx.state.accessToken = accessToken
    }
  }

  await next()
}
