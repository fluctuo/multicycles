import { ApolloLink, concat } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default ctx => {
  const httpLink = new HttpLink({ uri: process.env.MULTICYCLES_API || ctx.store.state.env.MULTICYCLES_API })
  const authLink = new ApolloLink((operation, forward) => {
    const jwtCookie = process.server
      ? ctx.req.headers.cookie
        ? ctx.req.headers.cookie.split(';').find(c => c.trim().startsWith('auth._token.auth0'))
        : false
      : localStorage.getItem('auth._token.auth0')

    if (jwtCookie) {
      operation.setContext({
        headers: { Authorization: `${process.server ? decodeURI(jwtCookie.split('=')[1]) : jwtCookie}` }
      })
    }

    return forward(operation)
  })

  return {
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache()
  }
}
