<template>
  <span v-if="this.object">
    {{ object.name }}
    (
      <span v-for="(arg, index) in object.args" :key="arg.name">
        {{ arg.name }}: <type :type="arg.type" />
        <span v-if="index + 1 < object.args.length ">, </span>
      </span>
    ) :
    <type :type="this.object.type" />
  </span>
</template>

<script>
import Type from '~/components/Type.vue'

export default {
  name: 'prototype',
  components: { Type },
  props: ['object']
}
</script>

