<template>
  <div class="home">
    <echarts-example></echarts-example>
  </div>
</template>

<script>
// @ is an alias to /src
import EchartsExample from '@/components/EchartsExample.vue'

export default {
  name: 'Home',
  components: {
    EchartsExample
  }
}
</script>
