<template>
<!-- 点赞 -->
  <van-icon
    :class="{liked : value === 1}"
    :name="value === 1 ? 'good-job':'good-job-o'"
    @click="onLike"
    :loading="loading"
  />
</template>

<script>
import { addLike, delLike } from '@/api/article.js'

export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    }
  },
  data () {
    return {
      loading: false,
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onLike() {
      this.loading = true;
      try {
        let status = -1;
        // 已点赞，取消点赞
        if (this.value === 1) {
          await delLike(this.articleId);
        } else {
          // 未点赞
          await addLike(this.articleId);
          status = 1;
        }
        this.$emit('input', status);
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞');
      } catch (err) {
        this.$toast.fail('操作失败，请重试！');
      }
      this.loading = false;
    }
  },
  created () {},
  mounted () {},
}
</script>

<style lang="less" scoped>
.van-icon {
  color: #777;
}
.liked {
    color: #ffa550;
}
</style>
