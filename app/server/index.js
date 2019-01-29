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
  mergeSchemas
} = require('apollo-server')
const bodyParser = require('koa-bodyparser')
const jwt = require('jsonwebtoken')
const passport = require('./passport')
const schema = require('./schema')

const app = new Koa()

app.use(bodyParser())
app.use(cors())

passport(app)

const multicyclesPrivateLink = new HttpLink({
  uri: `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
  fetch
})

async function init() {
  const multicyclesApiSchema = await introspectSchema(multicyclesPrivateLink)

  const executableSchema = makeRemoteExecutableSchema({
    schema: multicyclesApiSchema,
    link: multicyclesPrivateLink
  })

  const transformedSchema = transformSchema(executableSchema, [
    new FilterRootFields((operation, rootField) => {
      return [
        'providers',
        'vehicles',
        'limeLogin',
        'birdLogin',
        'limeLoginOTP',
        'birdLoginOTP',
        'limeLoginRefresh',
        'limeLoginRefreshOTP',
        'birdLoginRefresh',
        'birdLoginRefreshOTP',
        'linkSubAccount'
      ].includes(rootField)
    })
  ])

  const server = new ApolloServer({
    schema: mergeSchemas({
      schemas: [transformedSchema, schema]
    }),
    context: ({ ctx }) => {
      if (ctx.request.header && ctx.request.header.authorization) {
        let user
        try {
          user = jwt.verify(ctx.request.header.authorization.replace('Bearer ', ''), process.env.JWT_SECRET)
        } catch (err) {
          console.log('INVALID JWT', err)
        }

        return {
          user
        }
      }
    }
  })

  server.applyMiddleware({ app })

  app.listen({ port: 3001 }, () => console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`))
}

init()

process.on('unhandledRejection', err => {
  console.error(err)
})
