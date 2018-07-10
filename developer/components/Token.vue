<template>
  <b-container fluid class="token">
    <b-row align-v="center">
      <b-col>
        Token #{{token.id}}
        <div class="access-token bg-light" v-if="token.value">
          {{ token.value }}
          <a href="#" v-clipboard:copy="token.value">
            <copy-icon class="copy"/>
          </a>
        </div>
        <div class="sub">
          <span>Created {{ token.createdAt | ago }} ago</span>
          <a v-if="deleteToken" class="delete" href="#" @click="promptDeleteToken(token.id)">Delete</a>
        </div>
      </b-col>
      <b-col :md="token.value ? 5 : 12" sm="12">
        <token-stats-chart :chart-data="token.stats" class="chart"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
import { CopyIcon } from 'vue-feather-icons'
import TokenStatsChart from './TokenStatsChart.vue'

export default {
  components: { CopyIcon, TokenStatsChart },
  props: ['token', 'deleteToken'],
  methods: {
    promptDeleteToken(id) {
      if (confirm('Are-you sure to delete this token ?')) {
        this.deleteToken(id);
      }
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

  .chart {
    height: 80px;
  }
}
</style>


