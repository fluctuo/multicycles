<template>
  <b-container>
    <b-row>
      <b-col v-if="costs" cols="3" align="center">
        <b-alert show variant="success">
          <h4 class="alert-heading">Costs</h4>
          <p>{{ costs }} units</p>
        </b-alert>
      </b-col>
      <b-col v-if="scope" cols="3" align="center">
        <b-alert show variant="ligth">
          <h4 class="alert-heading">Scope</h4>
          <p>
            <b-badge :variant="scopeBadge(scope)" pill>{{ scope }}</b-badge>
          </p>
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p>{{ cleanedDescription }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'GraphqlDescription',
  props: {
    description: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      costs: null,
      scope: null,
      cleanedDescription: ''
    }
  },
  watch: {
    description: function(value) {
      const parsed = value.match(/^(.*?\.)(?:\s|)(?:Costs (\d+) units\.|)(?:\s|)(?:Required scope (\w+:\w+)\.|)$/)

      if (!parsed) {
        this.cleanedDescription = value
      } else {
        this.cleanedDescription = parsed[1]
        this.costs = parsed[2]
        this.scope = parsed[3]
      }
    }
  },
  created() {
    const parsed = this.description.match(
      /^(.*?\.)(?:\s|)(?:Costs (\d+) units\.|)(?:\s|)(?:Required scope (\w+:\w+)\.|)$/
    )

    if (!parsed) {
      this.cleanedDescription = this.description
    } else {
      this.cleanedDescription = parsed[1]
      this.costs = parsed[2]
      this.scope = parsed[3]
    }
  },
  methods: {
    scopeBadge(scope) {
      let variant

      switch (scope) {
        case 'vehicles:read':
        case 'providers:read':
        case 'providers:login':
          variant = 'info'
          break
        default:
          variant = 'danger'
          break
      }

      return variant
    }
  }
}
</script>
