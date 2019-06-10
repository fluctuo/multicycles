<template>
  <div>
    <b-container fluid>
      <b-row class="mt-3">
        <b-col md="2">
          <b-button
            variant="primary"
            class="d-block d-sm-none w-100"
            @click="showMenu = !showMenu"
          >Menu Documentation</b-button>
          <div id="docsCollapse" :class="{ 'd-none': showMenu, 'd-sm-block': showMenu }">
            <nuxt-link to="/docs">
              <h2>Documentation</h2>
            </nuxt-link>
            <h2>API Reference</h2>
            <ul class="list-unstyled">
              <li>
                <nuxt-link to="/api">Introduction</nuxt-link>
              </li>
            </ul>

            <h3>Queries</h3>
            <ul class="list-unstyled">
              <li v-for="query in queries(this.$store.state.introspection)" :key="query.name">
                <nuxt-link
                  :to="{ name: 'api-type-value', params: { type: 'Query', value: query.name }}"
                >{{ query.name }}</nuxt-link>
              </li>
            </ul>

            <h3>Mutations</h3>
            <ul class="list-unstyled">
              <li
                v-for="mutation in mutations(this.$store.state.introspection)"
                :key="mutation.name"
              >
                <nuxt-link
                  :to="{ name: 'api-type-value', params: { type: 'Mutation', value: mutation.name }}"
                >{{ mutation.name }}</nuxt-link>
              </li>
            </ul>

            <h3>Types</h3>
            <ul class="list-unstyled">
              <li v-for="t in types(this.$store.state.introspection)" :key="t.name">
                <nuxt-link
                  :to="{ name: 'api-type-value', params: { type: 'Type', value: t.name }}"
                >{{ t.name }}</nuxt-link>
              </li>
            </ul>

            <h3>Enums</h3>
            <ul class="list-unstyled">
              <li v-for="t in enums(this.$store.state.introspection)" :key="t.name">
                <nuxt-link
                  :to="{ name: 'api-type-value', params: { type: 'Enum', value: t.name }}"
                >{{ t.name }}</nuxt-link>
              </li>
            </ul>
          </div>
        </b-col>
        <b-col md="9">
          <nuxt-child/>
        </b-col>
      </b-row>
    </b-container>

    <Contact/>
  </div>
</template>

<script>
import Contact from '~/components/Contact.vue'

const onlyQueries = ['vehicles', 'providers', 'zones', 'getAccounts', 'getAccount', 'getRides']
const onlyMutations = [
  'missingProvider',
  'createAccount',
  'updateAccount',
  'deleteAccount',
  'linkSubAccount',
  'limeLogin',
  'limeLoginOTP',
  'limeLoginRefresh',
  'limeLoginRefreshOTP',
  'birdLogin',
  'birdLoginOTP',
  'birdLoginRefresh',
  'birdLoginRefreshOTP',
  'tierLogin',
  'tierLoginRefresh',
  'ufoLogin',
  'ufoLoginRefresh',
  'hiveLogin',
  'hiveLoginRefresh',
  'flashLogin',
  'flashLoginOTP',
  'flashLoginRefresh',
  'flashLoginRefreshOTP',
  'startRide',
  'stopRide'
]
const onlyTypes = [
  'Provider',
  'Bcycle',
  'Bird',
  'BlueBikes',
  'Bolt',
  'BoltMobility',
  'Byke',
  'CallABike',
  'CapitalBikeshare',
  'CitiBike',
  'Cityscoot',
  'CoGo',
  'Coup',
  'Divvy',
  'Donkey',
  'Emmy',
  'Flash',
  'Ford',
  'Glyde',
  'Helbiz',
  'Hellobike',
  'Hive',
  'IndigoWheel',
  'IsraBike',
  'Jump',
  'Leo',
  'Lime',
  'Mobike',
  'Moovin',
  'Moow',
  'Nextbike',
  'NiceRide',
  'Obike',
  'Ofo',
  'Oribiky',
  'Pony',
  'Scutt',
  'Scoot',
  'SocialBicycles',
  'Spin',
  'TelOFun',
  'Tier',
  'Ufo',
  'Voi',
  'WhiteBikes',
  'Wind',
  'Yego',
  'Yobike'
]
const excludedEnums = ['__TypeKind', '__DirectiveLocation', 'InvoiceStatusEnum']

export default {
  head() {
    return {
      title: 'API references - Multicycles API',
      meta: [{ hid: 'description', name: 'description', content: 'API references for query Multicycles API.' }]
    }
  },
  components: {
    Contact
  },
  data() {
    return {
      showMenu: true
    }
  },
  computed: {
    introspection() {
      return this.$store.state.introspection
    }
  },
  methods: {
    queries: introspection => {
      if (!introspection) {
        return []
      }

      const q = introspection.__schema && introspection.__schema.types.filter(type => type.name === 'Query')

      return Array.isArray(q) && q[0].fields.filter(f => onlyQueries.includes(f.name))
    },
    mutations: introspection => {
      if (!introspection) {
        return []
      }

      const q = introspection.__schema && introspection.__schema.types.filter(type => type.name === 'Mutation')

      return Array.isArray(q) && q[0].fields.filter(f => onlyMutations.includes(f.name))
    },
    types: introspection => {
      if (!introspection) {
        return []
      }

      return (
        introspection.__schema &&
        introspection.__schema.types.filter(type => type.kind === 'OBJECT').filter(f => onlyTypes.includes(f.name))
      )
    },
    enums: introspection => {
      if (!introspection) {
        return []
      }

      return (
        introspection.__schema &&
        introspection.__schema.types.filter(type => type.kind === 'ENUM').filter(f => !excludedEnums.includes(f.name))
      )
    }
  }
}
</script>

<style lang="scss" scoped>
#docsCollapse.visible {
  display: none;
}

@media (min-width: 768px) {
  #docsCollapse.visible {
    display: block;
  }
}
</style>
