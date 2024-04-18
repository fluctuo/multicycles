const Koa = require('koa')
const cors = require('@koa/cors')
const { ApolloServer } = require('apollo-server-koa')
const { HttpLink } = require('apollo-link-http')
const fetch = require('node-fetch')
const {
  introspectSchema,
  makeRemoteExecutableSchema,
  FilterRootFields,
  transformSchema,
} = require('apollo-server')
const bodyParser = require('koa-bodyparser')
const RateLimit = require('koa2-ratelimit').RateLimit

const app = new Koa()

app.proxy = true

const limiter = RateLimit.middleware({
  interval: 1 * 60 * 1000,
  max: process.env.RATE_LIMIT_PER_MIN || 20,
})

app.use(async (ctx, next) => {
  if (ctx.request.method === 'POST' && ctx.request.path === '/graphql') {
    return limiter(ctx, next)
  }

  return next()
})
app.use(bodyParser())
app.use(
  cors({
    origin: process.env.FRONT_BASE_URL,
  })
)

app.use((ctx, next) => {
  if (
    ctx.request.method === 'POST' &&
    (!ctx.request.headers || !ctx.request.headers.origin || ctx.request.headers.origin !== process.env.FRONT_BASE_URL)
  ) {
    ctx.body = JSON.stringify({
      data: {
        vehicles: [],
      },
    })
    return
  } else {
    return next()
  }
})

const multicyclesPrivateLink = new HttpLink({
  uri: `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
  fetch
})

async function init() {
  const multicyclesApiSchema = await introspectSchema(multicyclesPrivateLink)

  const executableSchema = makeRemoteExecutableSchema({
    schema: multicyclesApiSchema,
    link: multicyclesPrivateLink,
  })

  const schema = transformSchema(executableSchema, [
    new FilterRootFields((operation, rootField) => {
      return [
        'providers',
        'vehicles',
      ].includes(rootField)
    }),
  ])

  const server = new ApolloServer({schema})

  server.applyMiddleware({ app })

  app.listen({ port: 3001 }, () => console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`))
}

init()

process.on('unhandledRejection', (err) => {
  console.error(err)
})
