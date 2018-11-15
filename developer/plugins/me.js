import gql from 'graphql-tag'

export default function(context) {
  if (context.app.$auth.loggedIn) {
    let client = context.app.apolloProvider.defaultClient

    return client
      .query({
        query: gql`
          query {
            me {
              userId
              name
              organization
              email
              picture
              roles
              plan {
                name
                support
                limits
              }
              usage {
                tokens
                hitsPerMonth
              }
            }
          }
        `
      })
      .then(resp => {
        if (resp.data.me) {
          context.store.commit('user', resp.data.me)
        }
      })
      .catch(resp => context.app.$auth.logout())
  }
}
