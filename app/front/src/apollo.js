import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import VueApollo from 'vue-apollo'

import introspectionQueryResultData from './fragmentTypes.json'

const httpLink = new HttpLink({
  uri: `${process.env.API_URL}/graphql`
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    fragmentMatcher
  }),
  connectToDevTools: process.env.NODE_ENV !== 'production'
})

Vue.use(VueApollo)

export default new VueApollo({
  defaultClient: apolloClient
})
