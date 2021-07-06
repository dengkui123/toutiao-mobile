<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span
          @click="$emit('update-histories', [])"
        >全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon
        v-else
        name="delete"
        @click="isDeleteShow = true"
      />
    </van-cell>
    <van-cell
      :title="history"
      v-for="(history, index) in searchHistories"
      :key="index"
      @click="deleteHistory(history, index)"
    >
      <van-icon
        v-show="isDeleteShow"
        name="close"
      />
    </van-cell>
  </div>
</template>

<script>

export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true,
    }
  },
  data () {
    return {
      isDeleteShow: false, // 删除的显示状态
    }
  },
  watch: {},
  computed: {},
  methods: {
    deleteHistory(history, index) {
      // 删除状态
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1);
        return
      }
      // 非删除状态
      this.$emit('search', history);
    }
  },
  created () {},
  mounted () {},
}
</script>

<style lang="less" scoped>
</style>
