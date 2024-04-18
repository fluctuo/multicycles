import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import VueApollo from 'vue-apollo'

const httpLink = new HttpLink({
  uri: `${process.env.VUE_APP_API_URL}/graphql`,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  return token
    ? {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      }
    : { headers }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({}),
  connectToDevTools: process.env.NODE_ENV !== 'production',
})

Vue.use(VueApollo)

export default new VueApollo({
  defaultClient: apolloClient,
})
