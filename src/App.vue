<template>
  <div id="app">
    <keep-alive :include="cachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {},
  computed: {
    ...mapState(['cachePages'])
  },
  watch: {
    $route: {
      handler(val) {
        console.log('val', val);
      },
      immediate: true,
    }
  }
}
</script>

<style lang="less">

</style>
