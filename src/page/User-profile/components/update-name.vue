<template>
  <div class="update-name">
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="filed-wrap">
      <van-field
      v-model="localName"
      rows="2"
      autosize
      type="textarea"
      maxlength="7"
      placeholder="请输入昵称"
      show-word-limit
    />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true,
    }
  },
  data () {
    return {
      localName: this.value,
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      })
      try {
        const localName = this.localName;
        if (!localName.length) {
          this.$toast('昵称不能为空');
          return
        }
        await updateUserProfile({
          name: localName
        })
        this.$emit('input', localName);

        this.$emit('close');

        this.$toast.success('更新成功');
      } catch (err) {
        this.$toast.fail('更新失败');
      }
    }
  },
  created () {},
  mounted () {},
}
</script>

<style lang="less" scoped>
.filed-wrap {
  padding: 20px;
}
</style>
