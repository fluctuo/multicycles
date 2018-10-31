<template>
  <span>
    <span v-if="type.kind === 'LIST'">[<type :type="type.ofType" />]</span>
    <span v-else-if="type.kind === 'NON_NULL'"><type :type="type.ofType" />!</span>
    <span v-else-if="type.kind === 'OBJECT' || type.kind === 'ENUM' || type.kind === 'INTERFACE'"><nuxt-link :to="{name: 'api-type-value', params: {type: type.kind.toLowerCase().replace(/^\w/, c => c.toUpperCase()), value: type.name}}">{{ type.name }}</nuxt-link></span>
    <span v-else>{{ type.name }}</span>
  </span>
</template>

<script>
export default {
  name: 'Type',
  props: {
    type: {
      type: Object,
      required: true
    }
  }
}
</script>
