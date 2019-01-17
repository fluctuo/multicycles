import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

import introspectionQueryResultData from './fragmentTypes.json'

const httpLink = new HttpLink({
  uri: `${process.env.API_URL}/graphql`
})

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    fragmentMatcher
  }),
  connectToDevTools: process.env.NODE_ENV !== 'production'
})

Vue.use(VueApollo)

export default new VueApollo({
  defaultClient: apolloClient
})
