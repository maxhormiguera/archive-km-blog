import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { GRAPHQL_URI } from '../config'

const httpLink = new HttpLink({ uri: GRAPHQL_URI })

const setAuthorizationLink = setContext(() => {
  const token = localStorage.getItem('internal.meditab.com::token')
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

export const client = new ApolloClient({
  link: setAuthorizationLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

Vue.use(VueApollo)

export const apolloProvider = new VueApollo({
  defaultClient: client
})
