import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'
import graphqlHTTP from 'koa-graphql'

import schema from './schema'
import logger from './logger'
import jwt from './jwt'
import accessToken from './accessToken'

const app = new Koa()
const router = new Router()

router.post(
  '/v1',
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
