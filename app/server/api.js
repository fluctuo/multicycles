const { request } = require('graphql-request')

function createAccount() {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    mutation createAccount {
      createAccount {
        id
      }
    }
  `
  )
}

function getAccount(accountId) {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    query getAccount($accountId: String!) {
      getAccount(accountId: $accountId) {
        id
        name
        email
        subAccounts {
          puid
          status
          provider {
            name
            slug
          }
          name
          phone
          hasPaymentMethod
          referralCode
          createdAt
          refreshedAt
        }
      }
    }
  `,
    {
      accountId
    }
  )
}

function getActiveRides(accountId) {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    query getRides($accountId: String!) {
      getRides(accountId: $accountId, status: ["riding"], limit: 2) {
        total
        nodes {
          id
          startedAt
          provider {
            name
            slug
          }
        }
      }
    }
  `,
    {
      accountId
    }
  )
}

function startRide(accountId, { provider, token }) {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    mutation startRide($accountId: String!, $provider: String!, $token: String!) {
      startRide(accountId: $accountId, provider: $provider, token: $token) {
        id
        startedAt
        provider {
          name
          slug
        }
      }
    }
  `,
    {
      accountId,
      provider,
      token
    }
  )
}

function stopRide(accountId, { rideId }) {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    mutation stopRide($accountId: String!, $rideId: String!) {
      stopRide(accountId: $accountId, rideId: $rideId) {
        id
        startedAt
        provider {
          name
          slug
        }
      }
    }
  `,
    {
      accountId,
      rideId
    }
  )
}

module.exports = {
  request,
  createAccount,
  getAccount,
  getActiveRides,
  startRide,
  stopRide
}
