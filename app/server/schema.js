const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLBoolean
} = require('graphql')
const { GraphQLJSON } = require('graphql-type-json')
const api = require('./api')
const db = require('./db')
const fetch = require('node-fetch')

async function getDbUserFromContext(ctx) {
  if (!ctx.user) {
    throw new Error('not logged')
  }

  return db.findById(ctx.user.userId)
}
module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      getMyAccount: {
        type: GraphQLJSON,
        resolve: async (root, args, ctx) => {
          const user = await getDbUserFromContext(ctx)

          if (!user) {
            return null
          }

          return api.getAccount(user.account_id).then(data => data.getAccount)
        }
      },
      getMyActiveTrips: {
        type: GraphQLJSON,
        resolve: async (root, args, ctx) => {
          const user = await getDbUserFromContext(ctx)

          if (!user) {
            return null
          }

          return api.getActiveTrips(user.account_id).then(data => {
            if (data.getTrips.total > 0) {
              return data.getTrips.nodes
            } else {
              return null
            }
          })
        }
      },
      getMyCompletedTrips: {
        type: GraphQLJSON,
        resolve: async (root, args, ctx) => {
          const user = await getDbUserFromContext(ctx)

          if (!user) {
            return null
          }

          return api.getCompletedTrips(user.account_id).then(data => {
            if (data.getTrips.total > 0) {
              return data.getTrips.nodes
            } else {
              return null
            }
          })
        }
      },
      getStripeInformation: {
        type: GraphQLJSON,
        resolve: (root, args, ctx) => {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return api.getStripeInformation().then(data => data.getStripeInformation)
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createSubAccount: {
        type: GraphQLJSON,
        args: {
          provider: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve(root, args, ctx) {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db
            .findById(ctx.user.userId)
            .then(user =>
              api
                .createSubAccount(user.account_id, args.provider)
                .then(() => api.getAccount(user.account_id).then(data => data.getAccount))
            )
        }
      },
      startMyTrip: {
        type: GraphQLJSON,
        args: {
          provider: { type: new GraphQLNonNull(GraphQLString) },
          vehicleId: { type: new GraphQLNonNull(GraphQLString) },
          metadata: { type: new GraphQLNonNull(GraphQLString) },
          lat: { type: new GraphQLNonNull(GraphQLFloat) },
          lng: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve(root, args, ctx) {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db.findById(ctx.user.userId).then(user => {
            return api.startTrip(user.account_id, args).then(data => data.startTrip)
          })
        }
      },
      stopMyTrip: {
        type: GraphQLJSON,
        args: {
          provider: { type: new GraphQLNonNull(GraphQLString) },
          tripId: { type: new GraphQLNonNull(GraphQLString) },
          lat: { type: new GraphQLNonNull(GraphQLFloat) },
          lng: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve(root, args, ctx) {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db
            .findById(ctx.user.userId)
            .then(user => api.stopTrip(user.account_id, args))
            .then(data => data.stopTrip)
        }
      },
      payMyTrip: {
        type: GraphQLJSON,
        args: {
          accountId: { type: new GraphQLNonNull(GraphQLString) },
          tripId: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve(root, args, ctx) {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db
            .findById(ctx.user.userId)
            .then(user => api.payTrip(user.account_id, args))
            .then(data => data.payTrip)
        }
      },
      addPaymentMethod: {
        type: GraphQLJSON,
        args: {
          accountId: { type: new GraphQLNonNull(GraphQLString) },
          paymentMethodId: { type: GraphQLString }
        },
        resolve(root, args, ctx) {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db
            .findById(ctx.user.userId)
            .then(user => api.addPaymentMethod(user.account_id, args))
            .then(data => data.addPaymentMethod)
        }
      },
      removePaymentMethod: {
        type: GraphQLJSON,
        args: {
          accountId: { type: new GraphQLNonNull(GraphQLString) },
          paymentMethodId: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(root, args, ctx) {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db
            .findById(ctx.user.userId)
            .then(user => api.removePaymentMethod(user.account_id, args))
            .then(data => data.removePaymentMethod)
        }
      },
      setDefaultPaymentMethod: {
        type: GraphQLJSON,
        args: {
          accountId: { type: new GraphQLNonNull(GraphQLString) },
          paymentMethodId: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(root, args, ctx) {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db
            .findById(ctx.user.userId)
            .then(user => api.setDefaultPaymentMethod(user.account_id, args))
            .then(data => data.setDefaultPaymentMethod)
        }
      },
      setStripeStatus: {
        type: GraphQLJSON,
        args: {
          enabled: { type: new GraphQLNonNull(GraphQLBoolean) }
        },
        async resolve(root, { enabled }, ctx) {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          const url = new URL(`${process.env.SANDBOX_SIMULATE_URL}/setStripeStatus`)

          url.searchParams.append('access_token', process.env.MULTICYCLES_API_PRIVATE_TOKEN)
          url.searchParams.append('status', enabled ? 'true' : 'false')

          await fetch(url.href, { method: 'POST' })

          return true
        }
      }
    }
  })
})
