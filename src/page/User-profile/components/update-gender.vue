<template>
  <div class="update-gender">
    <van-picker
      title="设置性别"
      show-toolbar
      :default-index="value"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onPickChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true,
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value,
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
        const loaclGender = this.loaclGender;
        await updateUserProfile({
          gender: loaclGender
        })
        this.$emit('input', loaclGender);

        this.$emit('close');

        this.$toast.success('更新成功');
      } catch (err) {
        this.$toast.fail('更新失败');
      }
    },

    onPickChange(picker, value, index) {
      this.loaclGender = index;
    }
  },
  created () {},
  mounted () {},
}
</script>

<style lang="less" scoped>
</style>
