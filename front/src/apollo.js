import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

const httpLink = new HttpLink({
  uri: `${process.env.API_URL}/v1?access_key=${process.env.MULTICYCLES_ACCESS_KEY}`
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV !== 'production'
})

Vue.use(VueApollo)

export default new VueApollo({
  defaultClient: apolloClient
})
