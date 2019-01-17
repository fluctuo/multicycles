const Koa = require('koa')
const { ApolloServer } = require('apollo-server-koa')
const { HttpLink } = require('apollo-link-http')
const fetch = require('node-fetch')
const { introspectSchema, makeRemoteExecutableSchema, FilterRootFields, transformSchema } = require('apollo-server')

const app = new Koa()

const multicyclesPrivateLink = new HttpLink({
  uri: `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
  fetch
})

async function init() {
  const schema = await introspectSchema(multicyclesPrivateLink)

  const executableSchema = makeRemoteExecutableSchema({
    schema,
    multicyclesPrivateLink
  })

  const transformedSchema = transformSchema(executableSchema, [
    new FilterRootFields((operation, rootField) => {
      return ['providers', 'vehicles'].includes(rootField)
    })
  ])

  const server = new ApolloServer({ schema: transformedSchema })

  server.applyMiddleware({ app })

  app.listen({ port: 3001 }, () => console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`))
}

init()
