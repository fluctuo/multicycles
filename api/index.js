import Koa from 'koa'
import Router from 'koa-router'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'
import graphqlHTTP from 'koa-graphql'

import schema from './schema'

const app = new Koa()
const router = new Router()

router.all(
  '/v1',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV !== 'production',
    pretty: process.env.NODE_ENV !== 'production',
    formatError: error => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack,
      path: error.path
    })
  })
)

app
  .use(cors())
  .use(bodyparser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
