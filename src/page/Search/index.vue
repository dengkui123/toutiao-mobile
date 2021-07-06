<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="$router.back();"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    />
    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'
// import { getSearchHistories } from '@/api/search.js'
import { setItem, getItem } from '@/utils/storage.js'
import { mapState } from 'vuex'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: [],
    }
  },
  watch: {
    searchHistories() {
      setItem('search-histories', this.searchHistories);
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    onSearch(val) {
      this.searchText = val; // 把输入框设置为想要搜索的内容
      const index = this.searchHistories.indexOf(val);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      this.searchHistories.unshift(val); // 记录搜索历史记录

      // 搜索历史持久化（本地＋线上）
      // setItem('search-histories', this.searchHistories);
      this.isResultShow = true; // 展示搜索结果
    },
    // 保存历史记录
    async loadSearchHistories() {
      // 本地和线上搜索历史合并
      // if (this.user) {
      //   const { data } = await getSearchHistories();
      //   const resHistories = data.data.keywords;
      //   resHistories.push(...this.searchHistories.filter(item => {
      //     return resHistories.indexOf(item) === -1;
      //   }));
      // this.searchHistories = resHistories;
      // }
      // this.searchHistories.forEach(item => {
      //   if (resHistories.indexOf(item) === -1) {
      //     resHistories.push(item);
      //   }

      // console.log([...new Set([...searchHistories, ...data.data.keywords])]);
    },
  },
  created () {
    // this.loadSearchHistories();
    this.searchHistories = getItem('search-histories') || [];
  },
  mounted () {},
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>
