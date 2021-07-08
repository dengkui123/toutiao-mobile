<template>
  <div class="article-list">
    <!-- 文章列表 -->
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="reFreshSuccessText"
      success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="加载失败,请点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell
          v-for="( article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 文章列表
      loading: false, // 加载状态
      finished: false, // 结束状态
      timestamp: null, // 请求数据的时间戳
      error: false, // 加载错误
      isreFreshLoading: false, // 控制下拉刷新的状态
      reFreshSuccessText: '刷新成功',
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onLoad() {
      this.loading = true;
      // 异步更新数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          // 请求第一页数据的时间戳,请求之后数据的时间戳在请求返回数据中
          timestamp: this.timestamp || Date.now(),
          with_top: 1 // 是否包含置顶
        })
        const { results } = data.data;
        this.list.push(...results);

        // 加载结束把加载状态设为结束
        this.loading = false;

        if (results.length) {
          this.timestamp = data.data.pre_timestamp;
        } else {
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
        this.loading = false;
      }
    },

    async onRefresh() {
      // 下拉刷新数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          // 请求第一页数据的时间戳,请求之后数据的时间戳在请求返回数据中
          timestamp: Date.now(),
          with_top: 1 // 是否包含置顶
        })
        const { results } = data.data
        this.list.unshift(...results);
        // 关闭下拉刷新的loading状态
        this.isreFreshLoading = false;
        this.reFreshSuccessText = `刷新成功,更新了${results.length}条数据`;
      } catch (err) {
        this.isreFreshLoading = false;
        this.reFreshSuccessText = '刷新失败';
      }
    }
  },
  created() {
  },
  mounted() {},
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
