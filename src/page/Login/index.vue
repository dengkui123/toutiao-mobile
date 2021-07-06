<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="登录">
      <van-icon
        slot="left"
        name="arrow-left"
        @click="$router.back()"
      ></van-icon>
    </van-nav-bar>
    <!-- 登陆表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        type="number"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <template #button>
          <van-count-down
          v-if="isCountDownShow"
          :time="1000 * 60"
          format="ss s"
          @finish="isCountDownShow = false"/>
          <van-button
          v-else
            class="sen d-sms-btn"
            native-type="button"
            round size="small"
            type="default"
            @click="onSendSms"
            >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-warp">
        <van-button class="login-btn" block type="info" native-type="onSubmit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: '',
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空',
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空',
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }],
      },
      isCountDownShow: false,
    }
  },
  watch: {},
  computed: {},
  methods: {
    async onSubmit() {
      // 获取表单数据
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0 // 持续时间，如果为0则持续展示
      })

      try {
      // 提交表单请求登录
        const { data } = await login(this.user);
        console.log('登陆成功', data);
        this.$store.commit('setUser', data.data);
        this.$toast.success('登录成功');

        // 跳转回原来页面
        // back方法不严谨
        this.$router.back();
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误');
        } else {
          this.$toast.fail('登陆失败，请稍后再试', err);
        }
      }
      // 根据请求响应结果处理后续操作
    },

    async onSendSms() {
      try {
        this.$refs.loginForm.validate('mobile');
        console.log('验证通过');
      } catch (err) {
        return console.log('验证失败', err);
      }
      this.isCountDownShow = true;

      // 发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast('发送成功');
      } catch (err) {
        if (err.response.status === 429) {
          this.$toast('发送太频繁了,请稍后重试');
        } else {
          this.$toast('发送失败,清稍后再试');
        }
      }
    }
  },
  created() {},
  mounted() {}
}
</script>

<style lang="less" scoped>
.login-container{
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    background-color: #ededed;
    width: 156px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
  }
  .login-btn-warp {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border-color: #6db4fb;
    }
  }
}
</style>
