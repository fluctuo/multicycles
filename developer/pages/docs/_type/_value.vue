<template>
  <div v-if="selectedObject">
    <h4>{{ selectedObject.name }}</h4>
    <p>{{ selectedObject.description }}</p>

    <b-alert :show="!!selectedObject.isDeprecated" variant="danger">{{ selectedObject.deprecationReason }}</b-alert>

    <div v-if="selectedObject.args">
      <div class="prototype" v-html="renderPrototype(selectedObject)"></div>

      <h5>Fields</h5>
      <b-table striped hover responsive :items="selectedObject.args" :fields="fields">
        <template slot="type" slot-scope="data">
          {{ renderType(data.value) }}
        </template>
      </b-table>
    </div>

    <div v-if="selectedObject.interfaces && selectedObject.interfaces.length">
      <h5>Implements</h5>

      <ul>
        <li v-for="i in selectedObject.interfaces" :key="i.name">
          <nuxt-link :to="{ name: 'docs-type-value', params: { type: 'Type', value: i.name }}">{{ i.name }}</nuxt-link>
        </li>
      </ul>
    </div>

    <b-card v-if="selectedObject.fields">
      <h5>Fields</h5>

      <b-table striped hover responsive :items="selectedObject.fields" :fields="fields">
        <template slot="type" slot-scope="data">
          <span v-html="renderType(data.value)"></span>
        </template>
      </b-table>
    </b-card>

    <div v-if="selectedObject.possibleTypes">
      <h5>Implementations</h5>

      <ul>
        <li v-for="possibleType in selectedObject.possibleTypes" :key="possibleType.name">
          <nuxt-link :to="{ name: 'docs-type-value', params: { type: 'Type', value: possibleType.name }}">{{ possibleType.name }}</nuxt-link>
        </li>
      </ul>
    </div>

    <b-card v-if="selectedObject.enumValues">
      <h5>Values</h5>

      <b-table striped hover responsive :items="selectedObject.enumValues" :fields="enumFields"></b-table>
    </b-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    fields: ['name', 'type', 'description'],
    enumFields: ['name', 'description'],
    possibleTypesFields: ['Name']
  }),
  computed: {
    selectedObject() {
      if (!this.$store.state.introspection) {
        return;
      }

      const f = this.$store.state.introspection.__schema && this.$store.state.introspection.__schema.types.find((t) => t.name === this.$route.params.type || t.name === this.$route.params.value)

      if (this.$route.params.type !== 'Query') {
        return f;
      } else {
        return f.fields.find((field) => field.name === this.$route.params.value)
      }
    }

  },
  methods: {
    renderType(t) {
      let type;

      switch (t.kind) {
        case 'LIST':
          type = `[${this.renderType(t.ofType)}]`
          break;
        case 'NON_NULL':
          type = `${this.renderType(t.ofType)}!`
          break;
        case 'OBJECT':
        case 'ENUM':
        case 'INTERFACE':
          type = `<a href="/docs/${t.kind.toLowerCase().replace(/^\w/, c => c.toUpperCase())}/${t.name}">${t.name}</a>`
          break;
        default:
          type = `${t.name}`
          break;
      }

      return type;
    },
    renderPrototype(o) {
      if (!o || !o.args) {
        return;
      }

      const args = o.args.map((arg) => `${arg.name}: ${this.renderType(arg.type)}`)

      return `${o.name}(${args}): ${this.renderType(o.type)}`
    }
  }
}
</script>

<style lang="scss">
@import '~/scss/app.scss';

.prototype {
  font-family: 'Courier New', Courier, monospace;
  color: $light;
  background-color: $dark;

  margin: 20px 0;
  padding: 10px;

  a {
    color: $primary;
  }
}
</style>
