import test from 'ava'
import sinon from 'sinon'
import mockKnex from 'mock-knex'
import db from '../../db'
import auth0 from '../../auth0'
import mailchimp from '../../mailchimp'
import { getUser, getLimits } from '../../controllers/users'

let auth0GetStub
let mailchimpPostStub
const tracker = mockKnex.getTracker()

test.before(() => {
  mockKnex.mock(db)
  tracker.install()

  auth0GetStub = sinon.stub(auth0.users, 'get')
  mailchimpPostStub = sinon.stub(mailchimp, 'post')
})

test('Create user with getUsers()', async t => {
  auth0GetStub.callsFake(() =>
    Promise.resolve({
      email: 'user_a@gmail.com',
      user_id: 'github|123456789'
    })
  )

  mailchimpPostStub.callsFake((url, object) => {
    t.deepEqual(url, `/lists/${process.env.MAILCHIMP_DEFAULT_LIST}/members`)
    t.deepEqual(object, {
      email_address: 'user_a@gmail.com',
      status: 'subscribed'
    })

    return Promise.resolve()
  })

  tracker.on('query', query => {
    if (query.bindings[0] === 'user_a') {
      query.response([])
    }
  })

  await getUser('user_a')

  t.true(mailchimpPostStub.called)
})

test('Get user', async t => {
  auth0GetStub.callsFake(() =>
    Promise.resolve({
      email: 'user_b@gmail.com',
      user_id: 'github|987654321'
    })
  )

  tracker.on('query', query => {
    if (query.bindings[0] === 'user_b') {
      query.response([
        {
          id: '1',
          user_id: 'github|1214544',
          overwrited_limits: '',
          plan_id: 1,
          created_at: '2018-08-21 19:18:13.902637+02',
          updated_at: '2018-08-21 19:18:13.902637+02'
        }
      ])
    }
  })

  const user = await getUser('user_b')

  t.deepEqual(user, {
    email: 'user_b@gmail.com',
    user_id: 'github|1214544',
    id: '1',
    overwrited_limits: '',
    plan_id: 1,
    created_at: '2018-08-21 19:18:13.902637+02',
    updated_at: '2018-08-21 19:18:13.902637+02'
  })
})

test('Get limits for user', async t => {
  tracker.on('query', query => {
    if (query.bindings[0] === 'user_c') {
      query.response({
        overwrited_limits: '',
        limits: { tokens: 2, hitsPerMin: 10, hitsPerMonth: 6000 }
      })
    }
  })

  const limits = await getLimits('user_c')

  t.deepEqual(limits, { tokens: 2, hitsPerMin: 10, hitsPerMonth: 6000 })
})

test('Get limits for user with overwrited_limit', async t => {
  tracker.on('query', query => {
    if (query.bindings[0] === 'user_d') {
      query.response({
        overwrited_limits: { tokens: 5 },
        limits: { tokens: 2, hitsPerMin: 10, hitsPerMonth: 6000 }
      })
    }
  })

  const limits = await getLimits('user_d')

  t.deepEqual(limits, { tokens: 5, hitsPerMin: 10, hitsPerMonth: 6000 })
})
