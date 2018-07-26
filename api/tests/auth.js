import test from 'ava'
import { requireScope, requireAccessToken, requireAdmin } from '../auth'

test('should not throw for valid scope', t => {
  t.notThrows(() => requireScope({ scopes: ['read:tokens'] }, 'read:tokens'))
})

test('should not throw for invalid scope but admin', t => {
  t.notThrows(() => requireScope({ scopes: ['read:tokens'], roles: ['admin'] }, 'write:tokens'))
})

test('should throw for invalid scope', t => {
  t.throws(() => requireScope({ scopes: ['read:tokens'], roles: ['user'] }, 'write:tokens'))
})

test('should throw for missing user', t => {
  t.throws(() => requireScope(undefined, 'write:tokens'))
})

test('should not throw if accessToken is present', t => {
  t.notThrows(() => requireAccessToken('accessToken'))
})

test('should throw for missing accessToken', t => {
  t.throws(() => requireAccessToken())
})

test('should not throw if admin role is present', t => {
  t.notThrows(() => requireAdmin({ roles: ['admin'] }))
})

test('should throw for missing admin role', t => {
  t.throws(() => requireAdmin({ roles: [] }))
})

test('should throw for missing roles', t => {
  t.throws(() => requireAdmin({}))
})
