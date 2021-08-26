<template>
  <div>
    <div class="provider flex-container">
      <div>
        <img :src="providerLogo" alt />
      </div>
      <div class="link-btn">
        <div v-if="subAccount">
          <div v-if="subAccount.status === 'ok'" class="flex-container">
            {{ $t('account.linkedAccount') }}
            <check-icon />
          </div>
          <div v-else class="flex-container">
            <button class="btn" @click="linkSubAccount(provider, true)">{{ $t('account.needLogin') }}</button>
          </div>
        </div>
        <div v-else>
          <button class="btn" @click="linkSubAccount(provider)">{{ $t('account.login') }}</button>
        </div>
      </div>
    </div>

    <link-subaccount-modal
      v-if="showLinkSubAccountModal"
      @close="showLinkSubAccountModal = false"
      :provider="provider"
      :subAccount="subAccount"
      :refresh="refresh"
    ></link-subaccount-modal>
  </div>
</template>

<script>
import { CheckIcon } from 'vue-feather-icons'
import LinkSubaccountModal from './LinkSubaccountModal'

export default {
  name: 'MyAccount',
  props: {
    provider: {
      type: String,
      required: true
    }
  },
  components: {
    CheckIcon,
    LinkSubaccountModal
  },
  data() {
    return {
      showLinkSubAccountModal: false,
      providerLinkSubAccountModal: null,
      account: this.$store.state.myAccount,
      refresh: false
    }
  },
  computed: {
    providerLogo() {
      return `https://cdn.fluctuo.com/providers/${this.provider}.jpg`
    },
    subAccount() {
      return this.$store.state.myAccount.subAccounts.find(sa => sa.provider.slug === this.provider)
    }
  },
  methods: {
    loginUrl(service) {
      return `${process.env.VUE_APP_API_URL}/auth/${service}`
    },
    linkSubAccount(provider, refresh) {
      if (refresh) {
        this.refresh = true
      }
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
