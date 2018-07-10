import { createError } from 'apollo-errors'

const AuthenticatedError = createError('AuthenticatedError', {
  message: 'You are no authenticated or you don`t have the proper scope'
})

const AuthorizedError = createError('AuthorizedError', {
  message: 'Not Authorized, set a valid access_token'
})

function requireScope(user, scope) {
  if (!user || !user.scopes.includes(scope) || !user.roles.includes('admin')) {
    throw new AuthenticatedError()
  }
}

function requireAccessToken(accessToken) {
  if (!accessToken) {
    throw new AuthorizedError()
  }
}

function requireAdmin(user) {
  if (!user.roles.includes('admin')) {
    throw new AuthenticatedError()
  }
}

export { requireScope, requireAccessToken, requireAdmin }
