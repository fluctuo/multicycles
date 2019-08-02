<template>
  <b-container>
    <b-row>
      <b-col class="mb-5 pt-5">
        <b-breadcrumb :items="breadcrumb" class="d-print-none" />
        <h3 class="mb-4">Settings</h3>

        <b-alert v-if="$store.state.auth.user.subscription.plan.id !== 2" variant="info" show>
          <b-row>
            <b-col>
              <h4 class="alert-heading">Upgrade you account</h4>
              <p>Call the API without limit by upgrading to premium plan.</p>
            </b-col>
            <b-col class="align-items-center d-flex justify-content-center">
              <b-btn v-b-modal.planSelector variant="primary">Change plan</b-btn>
            </b-col>
          </b-row>
        </b-alert>

        <b-row>
          <b-col>
            <b-card title="Profile" sub-title="Update profile details">
              <edit-user-form :form="user" />
            </b-card>
          </b-col>
        </b-row>

        <b-row class="mt-3">
          <b-col>
            <b-card title="Billing">
              <h4 class="pt-3">Current plan</h4>
              <subscription-detail :subscription="$store.state.auth.user.subscription" />

              <h4 class="pt-3">Payment information</h4>
              <payment-information
                :payement-information="$store.state.auth.user.payementInformation"
              />

              <b-modal
                id="creditCard"
                ref="creditCardModal"
                title="Add credit card"
                hide-footer
                @open-credit-card-modal="openCreditCardModal"
              >
                <no-ssr>
                  <credit-card-form />
                </no-ssr>
              </b-modal>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal id="editUser" ref="editUserModal" title="Complete user detail" hide-footer>
      <edit-user-form :form="user" />
    </b-modal>
  </b-container>
</template>

<script>
import SubscriptionDetail from '~/components/SubscriptionDetail'
import PaymentInformation from '~/components/PaymentInformation'
import CreditCardForm from '~/components/CreditCardForm.vue'
import EditUserForm from '~/components/EditUserForm.vue'

export default {
  components: { SubscriptionDetail, PaymentInformation, CreditCardForm, EditUserForm },
  data() {
    return {
      breadcrumb: [
        {
          text: 'Account',
          href: '/account'
        },
        {
          text: `Settings`,
          active: true
        }
      ],
      user: {
        company: this.$store.state.auth.user.company || false,
        name: this.$store.state.auth.user.name,
        organization: this.$store.state.auth.user.organization,
        email: this.$store.state.auth.user.email,
        address1: this.$store.state.auth.user.address1,
        address2: this.$store.state.auth.user.address2,
        zipCode: this.$store.state.auth.user.zipCode,
        city: this.$store.state.auth.user.city,
        country: this.$store.state.auth.user.country,
        state: this.$store.state.auth.user.state,
        vatNumber: this.$store.state.auth.user.vatNumber
      }
    }
  },
  created() {
    this.$root.$on('openCreditCardModal', () => {
      this.openCreditCardModal()
    })
  },
  methods: {
    openCreditCardModal() {
      this.$refs.creditCardModal.show()
    }
  }
}
</script>

<style>
</style>
