<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3>{{ $t('LinkSubaccountModal.title', {provider}) }}</h3>
          </div>

          <div class="modal-body">
            <form @submit="submitStep">
              <p>{{ $t(`LinkSubaccountModal.${currentStep.description}`) }}</p>
              <div v-for="field in currentStep.fields" :key="field.name">
                <label :for="field.name">
                  {{ field.name }}
                  <br>
                  <input
                    :id="field.name"
                    v-model="form[field.name]"
                    :type="field.type"
                    :name="field.name"
                    required
                    :disabled="submiting"
                  >
                </label>
              </div>

              <button type="submit" class="btn--success btn--big" :disabled="submiting">
                {{ $t(`LinkSubaccountModal.${hasNextStep ? 'next' : 'link'}`) }}
                <loader-icon v-if="submiting" class="spinner"/>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import gql from 'graphql-tag'
import { mapActions } from 'vuex'
import { LoaderIcon } from 'vue-feather-icons'

const providerRequirements = {
  lime: {
    login: {
      steps: [
        {
          description: 'limeStep1',
          fields: [{ name: 'phone', type: 'text' }],
          mutation: `
          mutation($phone: String!){
            limeLogin(phone: $phone) {
              phone
            }
          }
        `
        },
        {
          description: 'limeStep2',
          fields: [{ name: 'otp', type: 'number' }],
          mutation: `
          mutation($phone: String!, $otp: String!){
            lastStep : limeLoginOTP(phone: $phone, otp: $otp) {
              puid
            }
          }
        `
        }
      ]
    },
    refresh: {
      initMutation: `
        mutation($puid: String!){
          limeLoginRefresh(puid: $puid) {
            nextStep
          }
        }
      `,
      steps: [
        {
          description: 'limeStep2',
          fields: [{ name: 'otp', type: 'number' }],
          mutation: `
        mutation($puid: String!, $otp: String!){
          limeLoginRefreshOTP(puid: $puid, otp: $otp) {
            puid
          }
        }
      `
        }
      ]
    }
  },
  bird: {
    login: {
      steps: [
        {
          description: 'birdStep1',
          fields: [{ name: 'email', type: 'email' }],
          mutation: `
            mutation($email: String!){
              birdLogin(email: $email) {
                email
              }
            }
          `
        },
        {
          description: 'birdStep2',
          fields: [{ name: 'otp', type: 'text' }],
          mutation: `
            mutation($otp: String!){
              lastStep : birdLoginOTP(otp: $otp) {
                puid
              }
            }
          `
        }
      ]
    },
    refresh: {
      initMutation: `
        mutation($puid: String!){
          birdLoginRefresh(puid: $puid) {
            nextStep
          }
        }
      `,
      steps: [
        {
          description: 'birdStep2',
          fields: [{ name: 'otp', type: 'text' }],
          mutation: `
        mutation($puid: String!, $otp: String!){
          birdLoginRefreshOTP(puid: $puid, otp: $otp) {
            puid
          }
        }
      `
        }
      ]
    }
  },
  tier: {
    login: {
      steps: [
        {
          description: 'fleedbirdStep',
          fields: [{ name: 'email', type: 'email' }, { name: 'password', type: 'password' }],
          mutation: `
            mutation($email: String!, $password: String!){
              lastStep : tierLogin(email: $email, password: $password) {
                puid
              }
            }
          `
        }
      ]
    },
    refresh: {
      steps: [
        {
          description: 'passwordStep',
          fields: [{ name: 'password', type: 'password' }],
          mutation: `
        mutation($puid: String!, $password: String!){
          tierLoginRefresh(puid: $puid, password: $password) {
            puid
          }
        }
      `
        }
      ]
    }
  },
  ufo: {
    login: {
      steps: [
        {
          description: 'fleedbirdStep',
          fields: [{ name: 'email', type: 'email' }, { name: 'password', type: 'password' }],
          mutation: `
            mutation($email: String!, $password: String!){
              lastStep : ufoLogin(email: $email, password: $password) {
                puid
              }
            }
          `
        }
      ]
    },
    refresh: {
      steps: [
        {
          description: 'passwordStep',
          fields: [{ name: 'password', type: 'password' }],
          mutation: `
        mutation($puid: String!, $password: String!){
          ufoLoginRefresh(puid: $puid, password: $password) {
            puid
          }
        }
      `
        }
      ]
    }
  },
  hive: {
    login: {
      steps: [
        {
          description: 'fleedbirdStep',
          fields: [{ name: 'email', type: 'email' }, { name: 'password', type: 'password' }],
          mutation: `
            mutation($email: String!, $password: String!){
              lastStep : hiveLogin(email: $email, password: $password) {
                puid
              }
            }
          `
        }
      ]
    },
    refresh: {
      steps: [
        {
          description: 'passwordStep',
          fields: [{ name: 'password', type: 'password' }],
          mutation: `
        mutation($puid: String!, $password: String!){
          hiveLoginRefresh(puid: $puid, password: $password) {
            puid
          }
        }
      `
        }
      ]
    }
  },
  circ: {
    login: {
      steps: [
        {
          description: 'phoneStep1',
          fields: [{ name: 'phone', type: 'text' }],
          mutation: `
          mutation($phone: String!){
            circLogin(phone: $phone) {
              phone
            }
          }
        `
        },
        {
          description: 'phoneStep2',
          fields: [{ name: 'otp', type: 'number' }],
          mutation: `
          mutation($phone: String!, $otp: String!){
            lastStep : circLoginOTP(phone: $phone, otp: $otp) {
              puid
            }
          }
        `
        }
      ]
    },
    refresh: {
      initMutation: `
        mutation($puid: String!){
          circLoginRefresh(puid: $puid) {
            nextStep
          }
        }
      `,
      steps: [
        {
          description: 'phoneStep2',
          fields: [{ name: 'otp', type: 'number' }],
          mutation: `
        mutation($puid: String!, $otp: String!){
          circLoginRefreshOTP(puid: $puid, otp: $otp) {
            puid
          }
        }
      `
        }
      ]
    }
  },
  moow: {
    login: {
      steps: [
        {
          description: 'fleedbirdStep',
          fields: [{ name: 'email', type: 'email' }, { name: 'password', type: 'password' }],
          mutation: `
            mutation($email: String!, $password: String!){
              lastStep : moowLogin(email: $email, password: $password) {
                puid
              }
            }
          `
        }
      ]
    },
    refresh: {
      steps: [
        {
          description: 'passwordStep',
          fields: [{ name: 'password', type: 'password' }],
          mutation: `
        mutation($puid: String!, $password: String!){
          moowLoginRefresh(puid: $puid, password: $password) {
            puid
          }
        }
      `
        }
      ]
    }
  }
}

export default {
  name: 'LinkSubaccountModal',
  props: {
    provider: {
      type: String,
      required: true
    },
    subAccount: {
      type: Object,
      required: false
    },
    refresh: {
      type: Boolean,
      required: false
    }
  },
  components: {
    LoaderIcon
  },
  created() {
    if (this.refresh) {
      this.action = 'refresh'

      if (providerRequirements[this.provider].refresh.initMutation) {
        this.$apolloProvider.defaultClient.mutate({
          mutation: gql(providerRequirements[this.provider].refresh.initMutation),
          variables: { puid: this.subAccount.puid }
        })
      }
    } else {
      this.action = 'login'
    }
  },
  data() {
    return {
      form: {},
      step: 0,
      submiting: false,
      action: null
    }
  },
  computed: {
    currentStep() {
      return providerRequirements[this.provider][this.action].steps[this.step]
    },
    hasNextStep() {
      return this.step < providerRequirements[this.provider][this.action].steps.length - 1
    }
  },
  methods: {
    ...mapActions(['login']),
    close(e) {
      if (e.path.indexOf('div.modal-container') === -1) {
        this.$emit('close')
      }
    },
    submitStep(e) {
      this.submiting = true
      e.preventDefault()

      const variables = JSON.parse(JSON.stringify(this.form))

      if (this.refresh) {
        variables.puid = this.subAccount.puid
      }

      this.$apolloProvider.defaultClient
        .mutate({
          mutation: gql(this.currentStep.mutation),
          variables
        })
        .then(result => {
          if (this.hasNextStep) {
            this.submiting = false
            this.step++
          } else {
            if (this.refresh) {
              return this.login().then(() => {
                this.$emit('close')
              })
            } else {
              return this.linkSubaccount(result.data.lastStep.puid).then(() => {
                this.submiting = false
              })
            }
          }
        })
    },
    linkSubaccount(puid) {
      return this.$apolloProvider.defaultClient
        .mutate({
          mutation: gql`
            mutation($accountId: String!, $puid: String!) {
              linkSubAccount(accountId: $accountId, puid: $puid) {
                id
              }
            }
          `,
          variables: {
            puid,
            accountId: this.$store.state.myAccount.id
          }
        })
        .then(() => this.login())
        .then(() => {
          this.$emit('close')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  p {
    width: 100%;
  }

  label {
    width: 100%;

    input { width: 100%; }
  }
}

@media (max-width: 480px) {
  form {
    flex-direction: column;
  }
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 90%;
  max-width: 576px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;

  color: #000;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

button {
  display: flex;
  align-items: center;
}

@keyframes spinner {
  to {transform: rotate(360deg);}
}

.spinner {
  margin: 0 5px;
  animation: spinner 4s linear infinite;
}
</style>

