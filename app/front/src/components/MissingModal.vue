<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3>{{ $t('MissingModal.header') }}</h3>
          </div>

          <div class="modal-body">
            <form @submit="submit">
              <p>{{ $t(`MissingModal.description`) }}</p>

              <label for="provider">
                {{ $t(`MissingModal.provider`) }}
                <br>
                <input
                  id="provider"
                  v-model="provider"
                  type="text"
                  name="provider"
                  required
                  :disabled="submiting"
                >
              </label>

              <span>&nbsp;{{ $t(`MissingModal.Location`) }}: {{ $store.state.geolocation[0] }} / {{ $store.state.geolocation[1] }}</span>

              <button type="submit" class="btn--success btn--big" :disabled="submiting">
                {{ $t('MissingModal.submit') }}
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
import { mapActions } from 'vuex'

export default {
  name: 'MissingModal',
  data() {
    return {
      provider: '',
      submiting: false
    }
  },
  methods: {
    ...mapActions(['missingProvider']),
    submit(e) {
      this.submiting = true
      e.preventDefault()

      this.missingProvider(this.provider)
        .then(() => {
          this.submiting = false
          return this.$emit('close')
        })
        .catch(() => (this.submiting = false))
    }
  }
}
</script>

<style lang="scss" scoped>
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
  text-align: center
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
  font-size: 1em;
  text-align: left;
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
  margin: 0 auto;
}

@keyframes spinner {
  to {transform: rotate(360deg);}
}

.spinner {
  margin: 0 5px;
  animation: spinner 4s linear infinite;
}
</style>

