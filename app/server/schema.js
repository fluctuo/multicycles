const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLFloat
} = require('graphql')
const api = require('./api')
const db = require('./db')

const MySubAccountType = new GraphQLObjectType({
  name: 'MySubAccount',
  fields: {
    puid: {
      type: GraphQLString
    },
    status: { type: GraphQLString },
    provider: {
      type: new GraphQLObjectType({
        name: 'MySubAccountProvider',
        description: 'A provider detail. A provider refer to a company or a service that rents vehicles.',
        fields: {
          name: { type: GraphQLString, description: 'Provider name' },
          slug: { type: GraphQLString, description: 'Provider slug, can be used as a key' }
        }
      })
    },
    name: { type: GraphQLString },
    phone: { type: GraphQLString },
    hasPaymentMethod: { type: GraphQLBoolean },
    referralCode: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    },
    refreshedAt: {
      type: GraphQLString
    }
  }
})

const MyAccountType = new GraphQLObjectType({
  name: 'MyAccount',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    subAccounts: {
      type: new GraphQLList(MySubAccountType)
    }
  }
})

const MyActiveRidesType = new GraphQLObjectType({
  name: 'MyActiveRides',
  fields: {
    id: { type: GraphQLString },
    startedAt: { type: GraphQLInt },
    provider: {
      type: new GraphQLObjectType({
        name: 'MyActiveRidesProvider',
        description: 'A provider detail. A provider refer to a company or a service that rents vehicles.',
        fields: {
          name: { type: GraphQLString, description: 'Provider name' },
          slug: { type: GraphQLString, description: 'Provider slug, can be used as a key' }
        }
      })
    }
  }
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      getMyAccount: {
        type: MyAccountType,
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
      getMyActiveRides: {
        type: new GraphQLList(MyActiveRidesType),
        resolve: (root, args, ctx) => {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db.findById(ctx.user.userId).then(user => {
            if (!user) {
              return null
            }

            return api.getActiveRides(user.account_id).then(data => {
              if (data.getRides.total > 0) {
                return data.getRides.nodes.map(r => ({
                  id: r.id,
                  startedAt: r.startedAt,
                  provider: r.provider
                }))
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
      startMyRide: {
        type: MyActiveRidesType,
        args: {
          provider: { type: new GraphQLNonNull(GraphQLString) },
          token: { type: new GraphQLNonNull(GraphQLString) },
          lat: { type: new GraphQLNonNull(GraphQLFloat) },
          lng: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve(root, args, ctx) {
          if (!ctx.user) {
            throw new Error('not logged')
          }

          return db
            .findById(ctx.user.userId)
            .then(user => api.startRide(user.account_id, args))
            .then(data => data.startRide)
        }
      },
      stopMyRide: {
        type: MyActiveRidesType,
        args: {
          rideId: { type: new GraphQLNonNull(GraphQLString) },
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
