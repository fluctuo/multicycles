<template>
  <span :class="statusClass" class="dot" />
</template>

<script>
export default {
  data() {
    return {
      status: 1
    }
  },
  computed: {
    statusClass() {
      return {
        ok: this.status === 1,
        medium: this.status === 2,
        high: this.status === 3
      }
    }
  },
  mounted() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      return this.$axios.get('https://status.multicycles.org/api/v1/components?per_page=50').then(res => {
        const statuses = res.data.data.reduce(
          (acc, c) => {
            acc[c.status]++

            return acc
          },
          {
            1: 0,
            2: 0,
            3: 0,
            4: 0
          }
        )

        if (statuses[4]) {
          this.status = 4
        } else if (statuses[3] || statuses[2]) {
          this.status = 2
        }
      })
    }
  }
}
</script>


<style lang="scss">
@import '~/scss/app.scss';

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 10px;

  &.ok {
    background-color: $success;
  }

  &.medium {
    background-color: $warning;
  }

  &.high {
    background-color: $danger;
  }
}
</style>
