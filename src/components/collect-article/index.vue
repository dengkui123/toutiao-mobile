<template>
  <van-icon
    :class="{collected : value}"
    :name="value ? 'star':'star-o'"
    @click="onCollect"
    :loading="loading"
  />
</template>

<script>
import { addCollect, delCollect } from '@/api/article.js'

export default {
  name: 'CollectArticle',
  components: {},
  props: {
    value: {
      type: Boolean,
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
    async onCollect() {
      this.loading = true;
      try {
        // 已收藏，取消收藏
        if (this.value) {
          await delCollect(this.articleId);
        } else {
          // 未收藏
          await addCollect(this.articleId);
        }
        this.$emit('input', !this.value);
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏');
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
.collected {
    color: #ffa550;
}
</style>
