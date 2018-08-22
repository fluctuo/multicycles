import auth0 from '../auth0'
import db from '../db'

function getUsers(params) {
  return auth0.users.getAll(params).then(result => {
    return db('users')
      .select(['user_id', 'plan_id', 'overwrited_limits'])
      .whereIn('user_id', result.users.map(u => u.user_id))
      .then(users => {
        return {
          ...result,
          users: result.users.map(au => ({ ...au, ...users.find(u => u.user_id === au.user_id) }))
        }
      })
  })
}

function getUser(userId) {
  return auth0.users.get({ id: userId }).then(auth0User => {
    return db('users')
      .where({ user_id: userId })
      .select(['user_id', 'plan_id', 'overwrited_limits'])
      .first()
      .then(user => {
        if (user) {
          return {
            ...auth0User,
            ...user
          }
        } else {
          return db('users')
            .insert({
              user_id: userId
            })
            .returning(['user_id', 'plan_id', 'overwrited_limits'])
            .get(0)
            .then(user => ({
              ...auth0User,
              ...user
            }))
        }
      })
  })
}

function getLimits(userId) {
  return db('users')
    .first(['users.overwrited_limits', 'plans.limits'])
    .innerJoin('plans', function() {
      this.on('plans.id', '=', 'users.plan_id')
    })
    .where('users.user_id', userId)
    .then(result => ({
      ...result.limits,
      ...result.overwrited_limits
    }))
}

export { getUsers, getUser, getLimits }
