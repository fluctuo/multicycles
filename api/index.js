import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'
import graphqlHTTP from 'koa-graphql'
import basicAuth from 'basic-auth'

import schema from './schema'
import logger from './logger'
import jwt from './jwt'
import accessToken from './accessToken'
import rateLimit from './rateLimit'

import metrics from './metrics'
import { allProviders } from './utils'

const app = new Koa()
const router = new Router()

router.post(
  '/v1',
  rateLimit,
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
    pretty: process.env.NODE_ENV !== 'production',
    formatError: error => {
      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
        path: error.path
      }
    }
  })
)

router.get('/health', ctx => {
  ctx.body = JSON.stringify({
    ok: true
  })
})

router.get('/metrics', ctx => {
  const user = basicAuth(ctx.req)

  if (!user || user.name !== process.env.INTERNAL_AUTH_NAME || user.pass !== process.env.INTERNAL_AUTH_PASSWORD) {
    ctx.throw(401)
  }

  ctx.body = metrics.register.metrics()
})

router.get('/checkproviders', ctx => {
  const user = basicAuth(ctx.req)

  if (!user || user.name !== process.env.INTERNAL_AUTH_NAME || user.pass !== process.env.INTERNAL_AUTH_PASSWORD) {
    ctx.throw(401)
  }

  return Promise.all(
    allProviders.map(provider =>
      import(`./controllers/providers/${provider}`)
        .then(async module => ({
          provider,
          ...(await module.checkWorking())
        }))
        .catch(e => {
          console.error('checkWorking', provider, e)
          return Promise.resolve({
            provider,
            working: false,
            latency: -1
          })
        })
    )
  ).then(results => {
    ctx.body = results
  })
})

app.proxy = true

app
  .use(cors())
  .use(bodyparser())
  .use(jwt)
  .use(accessToken)
  .use(router.routes())
  .use(router.allowedMethods())

app.on('error', err => {
  logger.exception(err)
})

app.listen(3000)
