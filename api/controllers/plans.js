import db from '../db'

function getPlan(id, overwritedLimit) {
  return db('plans')
    .where({ id })
    .first()
    .then(plan => {
      if (overwritedLimit) {
        plan.limits = {
          ...plan.limits,
          ...overwritedLimit
        }
      }

      return plan
    })
}

export { getPlan }
