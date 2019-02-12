<template>
  <div>
    <h4>Login to Lime</h4>

    <p>The login to Lime requires a mobile phone number in international format. Use the
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Mutation', value: 'limeLogin'}}"
      >limeLogin</nuxt-link>&nbsp;query.
    </p>

    <graphql-playground :query="query" :variables="variables" :response="response"/>

    <p>The call to this mutation, will send an sms with an OTP code to return to a second mutation. See
      <nuxt-link
        :to="{name: 'api-type-value', params: {type: 'Mutation', value: 'limeLoginOTP'}}"
      >limeLoginOTP</nuxt-link>
    </p>

    <graphql-playground :query="query2" :variables="variables2" :response="response2"/>
  </div>
</template>

<script>
import GraphqlPlayground from '~/components/GraphqlPlayground.vue'
export default {
  components: { GraphqlPlayground },
  data: () => ({
    query: `mutation getLimeToken {
  limeLogin(phone: "+3361234567") {
    phone
  }
}`,
    variables: '{}',
    response: JSON.stringify(
      {
        data: {
          limeLogin: {
            phone: '+3361234567'
          }
        }
      },
      null,
      2
    ),
    query2: `mutation getLimeToken {
  limeLoginOTP(phone: "+3361234567", otp: "123456") {
    puid
  }
}`,
    variables2: '{}',
    response2: JSON.stringify(
      {
        data: {
          limeLoginOTP: {
            puid: 'YWNjb3VudDpjMmY0MzQ0My1jZWY0LTQ5YzYtYjk1My1jNjYwZWM0NmUyNzA='
          }
        }
      },
      null,
      2
    )
  })
}
</script>
