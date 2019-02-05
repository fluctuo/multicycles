<template>
  <div>
    <h3>Accounts</h3>

    <p>The Multicycles API allows you to list and create accounts.
      <br>Creating and retrieving accounts requires a private scope. The use of these mutations must be reserved for backend.
    </p>

    <get-accounts class="mt-4 mb-4"/>

    <create-account class="mt-4 mb-4"/>

    <p>Continue with
      <nuxt-link to="/api/subaccount">subaccount</nuxt-link>
    </p>
  </div>
</template>

<script>
import getAccounts from '~/components/docs/playground/getAccounts'
import createAccount from '~/components/docs/playground/createAccount'

export default {
  components: {
    getAccounts,
    createAccount
  },
  head() {
    return {
      title: 'Documentation - Accounts & subaccounts - Multicycles API',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Create accounts and link providers accounts to accounts with the API.'
        }
      ]
    }
  }
}
</script>
