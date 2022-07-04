const { request } = require('graphql-request')
const gql = require('graphql-tag')

async function gqlRequest(query, variables) {
  const url = new URL(process.env.MULTICYCLES_API_URL)

  url.searchParams.append('access_token', process.env.MULTICYCLES_API_PRIVATE_TOKEN)

  return request(url.href, query, variables)
}

const fragmentTrip = gql`
  fragment trip on Trip {
    id
    vehicleFriendlyId
    vehicleType
    provider {
      name
      slug
    }
    status
    startedAt
    startLocation {
      lat
      lng
    }
    completedAt
    completedLocation {
      lat
      lng
    }
    cost
    currency
    distance
    paymentStatus
  }
`

const fragmentsubAccount = gql`
  fragment subAccount on SubAccount {
    id
    type
    status
    provider {
      slug
      name
    }
    hasPaymentMethod
    referralCode
    createdAt
  }
`

const fragmentAccount = gql`
  ${fragmentsubAccount}
  fragment account on Account {
    id
    externalId
    firstName
    lastName
    phone
    email
    subAccounts {
      ...subAccount
    }
    paymentMethods {
      id
      type
      isDefault
      card {
        last4
        expMonth
        expYear
        brand
      }
    }
  }
`

function createAccount({ firstName, lastName, email, phone }) {
  return gqlRequest(
    gql`
      ${fragmentAccount}
      mutation($firstName: String!, $lastName: String!, $email: String!, $phone: String!, $externalId: String) {
        createAccount(
          firstName: $firstName
          lastName: $lastName
          email: $email
          phone: $phone
          externalId: $externalId
        ) {
          ...account
        }
      }
    `,
    { firstName, lastName, email, phone }
  )
}

function getAccount(accountId) {
  return gqlRequest(
    gql`
      ${fragmentAccount}
      query($accountId: String) {
        getAccount(accountId: $accountId) {
          ...account
        }
      }
    `,
    {
      accountId
    }
  )
}

function createSubAccount(accountId, provider) {
  console.log('createSubAccount', accountId, provider)

  return gqlRequest(
    gql`
      ${fragmentsubAccount}
      mutation($accountId: String!, $provider: String!) {
        createSubAccount(accountId: $accountId, acceptTerms: true, type: SEAMLESS, provider: $provider) {
          message {
            key
            text
            type
          }
          subAccount {
            ...subAccount
          }
        }
      }
    `,
    {
      accountId,
      provider
    }
  )
}

function getTrips(accountId, status) {
  return gqlRequest(
    gql`
      ${fragmentTrip}
      query($accountId: String!, $status: [String]) {
        getTrips(accountId: $accountId, status: $status) {
          page
          limit
          total
          nodes {
            ...trip
          }
        }
      }
    `,
    {
      accountId,
      status: status ? [status] : undefined
    }
  )
}

function getActiveTrips(accountId) {
  return getTrips(accountId, 'riding')
}

function getCompletedTrips(accountId) {
  return getTrips(accountId, 'completed')
}

function startTrip(accountId, { provider, vehicleId, metadata, lat, lng }) {
  return gqlRequest(
    gql`
      ${fragmentTrip}
      mutation(
        $accountId: String!
        $provider: String!
        $lat: Float!
        $lng: Float!
        $vehicleId: String!
        $metadata: String
        $externalId: String
      ) {
        startTrip(
          accountId: $accountId
          provider: $provider
          lat: $lat
          lng: $lng
          vehicleId: $vehicleId
          metadata: $metadata
          externalId: $externalId
        ) {
          message {
            key
            text
            type
          }
          paymentIntent {
            status
            clientSecret
          }
          trip {
            ...trip
          }
        }
      }
    `,
    {
      accountId,
      provider,
      vehicleId,
      metadata,
      lat,
      lng
    }
  )
}

function stopTrip(accountId, { provider, lat, lng, tripId }) {
  return gqlRequest(
    gql`
      ${fragmentTrip}
      mutation($accountId: String!, $tripId: String!, $lat: Float!, $lng: Float!) {
        stopTrip(accountId: $accountId, tripId: $tripId, lat: $lat, lng: $lng) {
          message {
            key
            text
            type
          }
          paymentIntent {
            status
            clientSecret
          }
          trip {
            ...trip
          }
        }
      }
    `,
    {
      accountId,
      provider,
      lat,
      lng,
      tripId
    }
  )
}

function payTrip(accountId, { tripId }) {
  return gqlRequest(
    gql`
      ${fragmentTrip}
      mutation($accountId: String!, $tripId: String!) {
        payTrip(accountId: $accountId, tripId: $tripId) {
          message {
            key
            text
            type
          }
          trip {
            ...trip
          }
          paymentIntent {
            id
            status
            clientSecret
          }
        }
      }
    `,
    {
      accountId,
      tripId
    }
  )
}

function addPaymentMethod(accountId, { paymentMethodId }) {
  return gqlRequest(
    gql`
      mutation($accountId: String!, $paymentMethodId: String) {
        addPaymentMethod(accountId: $accountId, paymentMethodId: $paymentMethodId) {
          id
          status
          clientSecret
        }
      }
    `,
    {
      accountId,
      paymentMethodId
    }
  )
}

function removePaymentMethod(accountId, { paymentMethodId }) {
  return gqlRequest(
    gql`
      mutation($accountId: String!, $paymentMethodId: String!) {
        removePaymentMethod(accountId: $accountId, paymentMethodId: $paymentMethodId) {
          id
        }
      }
    `,
    {
      accountId,
      paymentMethodId
    }
  )
}

function setDefaultPaymentMethod(accountId, { paymentMethodId }) {
  return gqlRequest(
    gql`
      mutation($accountId: String!, $paymentMethodId: String!) {
        setDefaultPaymentMethod(accountId: $accountId, paymentMethodId: $paymentMethodId) {
          id
        }
      }
    `,
    {
      accountId,
      paymentMethodId
    }
  )
}

function getStripeInformation() {
  return gqlRequest(gql`
    query {
      getStripeInformation {
        stripeAccountId
        stripePublishableKey
      }
    }
  `)
}

module.exports = {
  request,
  createAccount,
  getAccount,
  createSubAccount,
  getActiveTrips,
  getCompletedTrips,
  startTrip,
  stopTrip,
  payTrip,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  getStripeInformation
}
