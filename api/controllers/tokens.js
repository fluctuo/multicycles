import db from '../db'

function getLimits(tokenId) {
  return db('tokens')
    .first(['users.overwrited_limits', 'plans.limits'])
    .innerJoin('users', function() {
      this.on('users.user_id', '=', 'tokens.userId')
    })
    .innerJoin('plans', function() {
      this.on('plans.id', '=', 'users.plan_id')
    })
    .where('tokens.id', tokenId)
    .then(result => ({
      ...result.limits,
      ...result.overwrited_limits
    }))
}

export { getLimits }
