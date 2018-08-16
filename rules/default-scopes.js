function (user, context, callback) {
  context.idToken.scopes = ['read:tokens', 'create:tokens', 'update:tokens', 'delete:tokens'];
  callback(null, user, context);
}
