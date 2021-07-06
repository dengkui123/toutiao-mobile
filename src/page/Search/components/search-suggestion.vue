<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestionLists"
      :key="index"
      @click="$emit('search', text)"
    >
      <span
        slot="title"
        v-html="highLight(text)"
      ></span>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
// 延迟处理
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestionLists: [],
    }
  },
  watch: {
    searchText: {
      handler: debounce(function(val) {
        this.loadSearchSuggestion(val);
      }, 200),
      immediate: true,
    }
  },
  computed: {},
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q);
        this.suggestionLists = data.data.options;
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highLight(text) {
      // RegExp 正则表达式构造函数
      // 参数1：匹配模式字符串，根据字符串创建正则对象
      // 参数2：匹配模式，要学到字符串中
      const reg = new RegExp(this.searchText, 'gi');
      return text.replace(reg, `<span class="active">${this.searchText}</span>`)
    }
  },
  created () {},
  mounted () {},
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
