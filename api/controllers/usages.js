import db from '../db'

function tokensCount(userId) {
  return db('tokens')
    .where('userId', userId)
    .count('id')
    .then(result => result[0].count)
}

function hitsPerMonth(userId) {
  return db('tokens')
    .sum('hits')
    .innerJoin('stats', function() {
      this.on('stats.token_id', '=', 'tokens.id')
    })
    .where('tokens.userId', userId)
    .andWhere('date', '>', db.raw("date_trunc('month', current_date)"))
    .groupBy('tokens.userId')
    .then(result => (result && result[0] ? result[0].sum : 0))
}

export { tokensCount, hitsPerMonth }
