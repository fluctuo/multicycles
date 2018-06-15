import jwt from 'koa-jwt'
import { koaJwtSecret } from 'jwks-rsa'

export default jwt({
  passthrough: true,
  secret: koaJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://multicycles.eu.auth0.com/.well-known/jwks.json'
  }),
  // audience: 'https://developer.multicycles.org/',
  issuer: 'https://multicycles.eu.auth0.com/',
  algorithms: ['RS256']
})
