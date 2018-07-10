import { ManagementClient } from 'auth0'

var auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
})

function getUsers(params) {
  return auth0.users.getAll(params)
}

export { getUsers }
