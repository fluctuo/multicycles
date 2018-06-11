<template>
  <b-container>
    <b-row>
      <b-col align="center">
        <h3 class="display-4 pt-5 pb-4">Account</h3>

        <h4>Token API</h4>

        <b-row>
          <b-col>
            <div class="token bg-light" v-for="token in tokens" :key="token.id">
              {{ token.token }}
            </div>
          </b-col>
        </b-row>

        <b-button variant="primary" class="mt-2">Create token</b-button>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Trash2Icon, CopyIcon } from 'vue-feather-icons'

export default {
  middleware: ['auth'],
  components: {
    Trash2Icon, CopyIcon
  },
  data() {
    return {
      tokens: []
    }
  },
  asyncData() {
    return {
      tokens: [{
        id: 1,
        token: 'pk.eyJ1IjoicGllcnJpY2twIiwiYSI6ImNqZGExbnhoOTB2ZHoydnBjdG1qczJmOXcifQ.LHd8zFvfEV_qPh1tcue2Nw'
      }]
    }
  }
}
</script>

<style>
.token {
  padding: 3px 10px;
  word-wrap: break-word;
}
</style>
