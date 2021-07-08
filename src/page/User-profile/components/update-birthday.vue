<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs';
export default {
  name: 'UpdateBirtday',
  components: {},
  props: {
    value: {
      type: String,
      required: true,
    }
  },
  data () {
    return {
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
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
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD');
        await updateUserProfile({
          birthday: currentDate
        })
        this.$emit('input', currentDate);

        this.$emit('close');
        this.$toast.success('更新成功');
      } catch (err) {
        this.$toast.fail('更新失败');
      }
    },

    onPickChange(picker, value, index) {
      this.currentDate = index;
    }
  },
  created () {},
  mounted () {},
}
</script>

<style lang="less" scoped>

</style>
