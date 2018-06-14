import { ApolloLink, concat } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'

export default ctx => {
  const httpLink = new HttpLink({ uri: process.env.MULTICYCLES_API })
  const authLink = new ApolloLink((operation, forward) => {
    const jwtCookie = process.server
      ? ctx.req.headers.cookie.split(';').find(c => c.trim().startsWith('auth._token.auth0'))
      : localStorage.getItem('auth._token.auth0')

    if (jwtCookie) {
      operation.setContext({
        headers: { Authorization: `${process.server ? jwtCookie.split('=')[1] : jwtCookie}` }
      })
    }

    return forward(operation)
  })
  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      // @TODO if faut le faire marcher et le linker
      // console.log(ctx.route)
      // return ctx.redirect('/login')
    }
  })

  return {
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  }
}
