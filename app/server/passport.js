const Router = require('koa-router')
const passport = require('koa-passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const db = require('./db')
const jwt = require('jsonwebtoken')

if (process.env.GOOGLE_CONSUMER_KEY) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CONSUMER_KEY,
        clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
        callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`
      },
      function(accessToken, refreshToken, profile, done) {
        db.findOrCreateUser('google_id', profile.id)
          .then(user => done(null, user))
          .catch(err => done(err))
      }
    )
  )
}

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  db.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err))
})

module.exports = app => {
  const router = new Router()

  app.use(passport.initialize())

  router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

  router.get(
    '/auth/google/callback',

    function(ctx, next) {
      return passport.authenticate(
        'google',
        { session: false, failureRedirect: `${process.env.FRONT_BASE_URL}/login` },
        function(err, user, info) {
          if (user === false) {
            ctx.status = 401
            ctx.body = { success: false }
          } else {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1y' })
            ctx.redirect(`${process.env.FRONT_BASE_URL}/?jwt=${token}`)
          }
        }
      )(ctx, next)
    }
  )

  app.use(router.routes()).use(router.allowedMethods())
}
