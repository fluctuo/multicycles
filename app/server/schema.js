const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLFloat } = require('graphql')
const { GraphQLJSON } = require('graphql-type-json')
const api = require('./api')
const db = require('./db')

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      getMyAccount: {
        type: GraphQLJSON,
        resolve: (root, args, ctx) => {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db.findById(ctx.user.userId).then(user => {
            if (!user) {
              return null
            }

            return api.getAccount(user.account_id).then(data => data.getAccount)
          })
        }
      },
      getMyActiveTrip: {
        type: GraphQLJSON,
        resolve: (root, args, ctx) => {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db.findById(ctx.user.userId).then(user => {
            if (!user) {
              return null
            }

            return api.getActiveTrip(user.account_id).then(data => {
              if (data.getTrips.total > 0) {
                return data.getTrips.nodes
              } else {
                return null
              }
            })
          })
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
          token: { type: GraphQLString },
          vehicleId: { type: GraphQLString },
          metadata: { type: GraphQLString },
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
            .then(user => api.stopRide(user.account_id, args))
            .then(data => data.stopRide)
        }
      }
    }
  })
})
