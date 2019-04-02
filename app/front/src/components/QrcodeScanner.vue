<template>
  <div style="width: 100%">
    <a @click="showScannerModal = true" class="scan-button">
      <camera-icon/>Unlock
    </a>

    <transition name="modal">
      <div v-if="showScannerModal" class="modal-mask" @click="showScannerModal= false">
        <div class="modal-wrapper">
          <div class="modal-container" @click.stop>
            <div class="modal-body">
              <qrcode-stream @decode="onDecode" :paused="paused">
                <div v-show="paused" class="validation-layer">
                  <div>
                    <div v-if="validating">{{ $t('QrcodeScanner.unlocking') }}</div>

                    <div v-else class="invalid">
                      <div class="alert--warning">{{ $t('QrcodeScanner.notAvailable') }}</div>
                    </div>
                  </div>
                </div>
              </qrcode-stream>
              <p>{{ $t('QrcodeScanner.scanTheQRCode') }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import { CameraIcon } from 'vue-feather-icons'
import { mapActions } from 'vuex'

export default {
  name: 'QrcodeScanner',
  components: {
    QrcodeStream,
    CameraIcon
  },
  props: ['provider'],
  data() {
    return {
      paused: false,
      isValid: false,
      validating: false,
      showScannerModal: false
    }
  },
  computed: {
    isLogged() {
      return this.$store.state.myAccount
    },
    subAccountProviders() {
      return this.$store.state.myAccount && this.$store.state.myAccount.subAccounts
        ? this.$store.state.myAccount.subAccounts.map(sa => sa.provider.slug)
        : []
    }
  },
  methods: {
    ...mapActions(['startMyRide']),
    onDecode(decoded) {
      this.paused = true
      this.validating = true

      if (decoded) {
        if (!this.isLogged || !this.subAccountProviders.includes(this.provider)) {
          this.paused = false
          this.showScannerModal = false
          return this.$router.push({ name: 'account' })
        }

        this.startMyRide({
          provider: this.provider,
          token: decoded
        })
          .then(() => {
            this.paused = false
            this.showScannerModal = false
          })
          .catch(() => {
            this.isValid = false
            this.validating = false
            this.paused = false
          })
      } else {
        this.isValid = false
        this.validating = false
        this.paused = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../app.scss';

.scan-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 60px;
  background: #fff;
  border-radius: 50px;
  color: $mainColor !important;
  margin: 10px 0;
  font-size: 2em;
  cursor: pointer;

  svg {
    width: 50px;
    height: 50px;
    padding: 5px;
  }

  &:hover {
    box-shadow: inset 0 0 5px 1px #afafaf
  }
}

.validation-layer {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, .8);
  text-align: center;
  padding: 10px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

.modal-container {
  width: 90%;
  max-width: 576px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;

  color: #000;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  font-size: 2em;
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
</style>


