const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList } = require('graphql')
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

          return db
            .findById(ctx.user.userId)
            .then(user => api.getAccount(user.account_id).then(data => data.getAccount))
        }
      }
    }
  })
})
