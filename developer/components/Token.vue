<template>
  <div class="token">
    <div class="access-token bg-light">
      {{ token.value }}
      <a href="#" v-clipboard:copy="token.value">
        <copy-icon class="copy"/>
      </a>
    </div>
    <div class="sub">
      <span>Created {{ token.createdAt | ago }} ago</span>
      <a class="delete" href="#" @click="promptDeleteToken(token.id)">Delete</a>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'
import { CopyIcon } from 'vue-feather-icons'

export default {
  components: { CopyIcon },
  props: ['token', 'deleteToken'],
  methods: {
    promptDeleteToken(id) {
      if (confirm('Are-you sure to delete this token ?')) {
        this.deleteToken(id);
      }
    },
    copy() {
      this.$co
      alert(this.token.value)
    }
  }
}
</script>

<style lang="scss">
.token {
  margin-top: 10px;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px;

  .access-token {
    text-align: left;
    padding: 5px 10px;
    font-family: monospace;
  }

  .copy {
    height: 19px;
    position: absolute;
    right: 28px;
  }

  .sub {
    font-size: 0.8em;
    color: lightgray;

    .delete {
      position: absolute;
      right: 28px;
    }
  }
}
</style>


