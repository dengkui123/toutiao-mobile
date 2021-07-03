<template>
  <div class="user-container">
    <div class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="avatar" :src="avatar">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserIndex',
  components: {},
  props: {},
  data () {
    return {
      avatar: '~@/assets/images/avatar.jpg',
    }
  },
  watch: {},
  computed: {},
  methods: {},
  created () {},
  mounted () {},
}
</script>

<style lang="less" scoped>
.user-container {
  .header {
    height: 361px;
    background: url('~@/assets/images/banner.jpeg');
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn{
      display:flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .avatar{
        display: block;
        width: 132px;
        height: 132px;
        background: rgba(255, 255, 255, 0.2);
        border: 3px solid #eee;
        border-radius: 50%;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #eee;
      }
    }
  }
}
</style>
