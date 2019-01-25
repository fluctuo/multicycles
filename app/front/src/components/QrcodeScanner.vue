<template>
  <div>
    <a @click="showScannerModal = true" class="scan-button">
      <camera-icon/>Ride
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

const regexps = [/^https:\/\/ride\.(bird)\.co\/(.+)$/m, /^https:\/\/(lime)\.bike\/bc\/v1\/(.+)$/m]

function parseQrcode(decodedString) {
  let provider
  let id

  for (let index = 0; index < regexps.length; index++) {
    const r = regexps[index]
    const parsed = decodedString.match(r)

    if (parsed && parsed.length === 3) {
      provider = parsed[1]
      id = parsed[2]
      break
    }
  }

  return provider && id ? { provider, id } : false
}

export default {
  name: 'QrcodeScanner',
  components: {
    QrcodeStream,
    CameraIcon
  },
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

      const parsed = parseQrcode(decoded)

      if (parsed && parsed.provider && parsed.id) {
        if (!this.isLogged || !this.subAccountProviders.includes(parsed.provider)) {
          this.paused = false
          this.showScannerModal = false
          return this.$router.push({ name: 'account' })
        }

        this.startMyRide({
          provider: parsed.provider,
          token: parsed.id
        }).then(() => {
          this.paused = false
          this.showScannerModal = false
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
  $size: 150px;

  position: absolute;
  z-index: 401;
  bottom: 66px;
  left: 50%;
  margin-left: -1 * $size / 2;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: $size;
  height: $size;
  background:$mainColor;
  border-radius: 50%;
  color: #fff !important;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  padding: 5px;
  font-size: 2em;

  svg {
    width: $size / 2;
    height: auto;
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


