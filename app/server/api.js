const { request } = require('graphql-request')

function createAccount({ firstName, lastName, email, phone }) {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    mutation(
      $firstName:String!,
      $lastName:String!,
      $email:String!,
      $phone:String!,
      $externalId:String
    ){
      createAccount(
        firstName:$firstName,
        lastName:$lastName,
        email:$email,
        phone:$phone,
        externalId:$externalId
      ) {
        id
        firstName
        lastName
        phone
        email
        subAccounts {
          id
          type
          status
          provider {
            name
          }
          hasPaymentMethod
          referralCode
          createdAt
        }
      }
    }
  `,
    { firstName, lastName, email, phone }
  )
}

function getAccount(accountId) {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    query($accountId: String){
      getAccount(accountId: $accountId) {
        id
        externalId
        firstName
        lastName
        phone
        email
        subAccounts {
          id
          type
          status
          provider {
            slug
          }
          hasPaymentMethod
          referralCode
          createdAt
        }
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

  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    mutation(
      $accountId: String!,
      $provider: String!
    ) {
      createSubAccount(
      accountId: $accountId,
      acceptTerms: true,
      type: SEAMLESS,
      provider: $provider
    ) {
      message {
        key
        text
        type
      }
      subAccount {
        id
        provider { name }
        status
        type
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

function getActiveTrip(accountId) {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    query ($accountId: String!){
      getTrips(accountId: $accountId, status: "riding"){
        page
        limit
        total
        nodes {
          id
          vehicleFriendlyId
          provider {
            name
            slug
          }
          status
          startedAt
          startLocation { lat lng }
          completedAt
          completedLocation { lat lng }
          cost
          currency
          distance
        }
      }
    }
  `,
    {
      accountId
    }
  )
}

function startTrip(accountId, { provider, vehicleId, metadata, lat, lng }) {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    mutation(
      $accountId: String!,
      $provider: String!,
      $lat: Float!,
      $lng: Float!,
      $vehicleId: String!,
      $metadata: String,
      $externalId: String
    ) {
      startTrip(
        accountId: $accountId,
        provider: $provider
        lat: $lat,
        lng: $lng,
        vehicleId: $vehicleId,
        metadata: $metadata,
        externalId: $externalId
      ) {
        message {
          key
          text
          type
        }
        trip {
          id
          provider { name slug }
          status
          cost
          currency
          startedAt
          startLocation { lat lng }
          completedAt
          completedLocation { lat lng }
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

function stopRide(accountId, { provider, lat, lng, tripId }) {
  return request(
    `${process.env.MULTICYCLES_API_URL}?access_token=${process.env.MULTICYCLES_API_PRIVATE_TOKEN}`,
    `
    mutation(
      $accountId: String!,
      $tripId: String!,
      $lat: Float!,
      $lng: Float!
    ) {
      stopTrip(
        accountId: $accountId,
        tripId: $tripId
        lat: $lat,
        lng: $lng
      ) {
        message {
          key
          text
          type
        }
        trip {
          id
          provider { name slug }
          status
          cost
          currency
          startedAt
          startLocation { lat lng }
          completedAt
          completedLocation { lat lng }
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

module.exports = {
  request,
  createAccount,
  getAccount,
  createSubAccount,
  getActiveTrip,
  startTrip,
  stopRide
}
