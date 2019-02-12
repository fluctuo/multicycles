<template>
  <div>
    <h3>Subaccounts & Linking</h3>

    <p>A subaccount refers to a provider account, linked to an
      <nuxt-link to="/docs/accounts">account</nuxt-link>.
      <br>Before linking the subaccount, it is necessary to generate a "puid" (Provider user id) using the mutation of provider's login.
      <br>Retrieving and linking subaccounts requires a private scope.
    </p>

    <p>Each providers requires a specific connection. So they use different mutations.</p>

    <lime-login class="mt-4 mb-4"/>

    <link-subaccount class="mt-4 mb-4"/>

    <p>Continue with
      <nuxt-link to="/docs/rides">rides</nuxt-link>
    </p>
  </div>
</template>

<script>
import limeLogin from '~/components/docs/playground/limeLogin'
import linkSubaccount from '~/components/docs/playground/linkSubaccount'

export default {
  components: {
    limeLogin,
    linkSubaccount
  },
  head() {
    return {
      title: 'Documentation - Subaccounts - Multicycles API',
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
