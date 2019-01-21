<template>
  <div>
    <div class="providers">
      <div class="provider flex-container">
        <div>
          <img src="../assets/providers/lime.jpg" alt>
        </div>
        <div class="link-btn">
          <div
            v-if="account.subAccounts.find(sa => sa.provider.name === 'Lime')"
            class="flex-container"
          >
            {{ $t('account.linkedAccount') }}
            <check-icon/>
          </div>
          <div v-else>
            <button class="btn" @click="linkSubAccount('lime')">{{ $t('account.login') }}</button>
          </div>
        </div>
      </div>

      <div class="provider flex-container">
        <div>
          <img src="../assets/providers/bird.jpg" alt>
        </div>
        <div class="link-btn">
          <div
            v-if="account.subAccounts.find(sa => sa.provider.name === 'Bird')"
            class="flex-container"
          >
            {{ $t('account.linkedAccount') }}
            <check-icon/>
          </div>
          <div v-else>
            <button class="btn" @click="linkSubAccount('bird')">{{ $t('account.login') }}</button>
          </div>
        </div>
      </div>
    </div>

    <link-subaccount-modal
      v-if="showLinkSubAccountModal"
      @close="showLinkSubAccountModal = false"
      :provider="providerLinkSubAccountModal"
    ></link-subaccount-modal>
  </div>
</template>

<script>
import { CheckIcon } from 'vue-feather-icons'
import LinkSubaccountModal from './LinkSubaccountModal'

export default {
  name: 'MyAccount',
  components: {
    CheckIcon,
    LinkSubaccountModal
  },
  data() {
    return {
      showLinkSubAccountModal: false,
      providerLinkSubAccountModal: null,
      account: this.$store.state.myAccount
    }
  },
  methods: {
    loginUrl(service) {
      return `${process.env.API_URL}/auth/${service}`
    },
    linkSubAccount(provider) {
      this.providerLinkSubAccountModal = provider
      this.showLinkSubAccountModal = true
    }
  }
}
</script>

<style lang="scss" scoped>
.provider {
  width: 100%;
  padding: 10px 0;

  .link-btn {
    margin: auto;
  }

  div + div {
    margin-right: 20px;
  }

  & + .provider {
    border-top: 1px solid #fff;
  }
}

@media (max-width: 575px) {
  .flex-container {
    flex-direction: row !important;
  }

}
</style>

