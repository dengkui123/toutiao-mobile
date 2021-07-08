<template>
  <van-list
    v-model="loading"
    :finished="finished"
    :finished-text="list.length===0?'无评论':'已经到底了'"
    :immediate-check="false"
  >
    <comment-item
      v-for="(comment,index) in list"
      :key="index"
      :comment="comment"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment.js'
import JSONBig from 'json-bigint'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false,
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onLoad() {
      this.loading = true;
      try {
        // 1.请求获取数据
        const { data } = await getComments({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: JSONBig.stringify(this.source), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // 2.将数据添加到列表中
        const { results } = data.data;
        this.list.push(...results);
        this.$emit('onLoad-success', data.data)
        // 3. loading设置为false
        this.loading = false;
        // 4. 判断是否还有下一页数据页码，没有finished设置为true
        if (results.length === this.limit) {
          this.offset = data.data.last_id;
        } else {
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
      }
    },
  },
  created () {
    this.onLoad();
  },
  mounted () {},
}
</script>

<style lang="less" scoped>

</style>
