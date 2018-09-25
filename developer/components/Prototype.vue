<template>
  <span v-if="object">
    {{ object.name }} (
    <span v-for="(arg, index) in object.args" :key="arg.name">
      {{ arg.name }}:
      <type :type="arg.type" />
      <span v-if="index + 1 < object.args.length ">, </span>
    </span>
    ) :
    <type :type="object.type" />
  </span>
</template>

<script>
import Type from '~/components/Type.vue'

export default {
  name: 'Prototype',
  components: { Type },
  props: {
    object: {
      type: Object,
      required: true
    }
  }
}
</script>
