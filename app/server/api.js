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

module.exports = {
  request,
  createAccount,
  getAccount,
  getActiveRides
}
