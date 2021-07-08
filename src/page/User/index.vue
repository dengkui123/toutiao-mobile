<template>
  <div class="user-container">
    <!-- 已登录 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left-info">
          <van-image
            class="avatar"
            :src="userInfo.photo"
            round
            fit="cover"
          />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="edit">
          <van-button
            size="mini"
            round
            to="/user/profile"
          >编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="avatar" src="~@/assets/images/avatar.jpg">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 导航 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="消息通知" is-link to="/" />
    <van-cell
      class="mb-4"
      title="小智同学"
      is-link to="/"
    />
    <van-cell
    v-if="user"
      class="logout-cell"
      title="退出登录"
      clickable
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'UserIndex',
  components: {},
  props: {},
  data () {
    return {
      // avatar: 'https://images.pexels.com/photos/2114014/pexels-photo-2114014.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      userInfo: {},
    }
  },
  watch: {},
  computed: {
    ...mapState(['user']),
  },
  methods: {
    onLogout () {
      // 退出提示
      // 确认退出: 清除登录状态(容器中的 user + 本地存储中的 user)
      this.$dialog.confirm({
        title: '确认退出吗?'
      })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null);
        })
        .catch(() => {
          // on cancel
        });
    },

    async loadUserInfo() {
      try {
        const { data } = await getUserInfo();
        console.log(data);
        this.userInfo = data.data;
      } catch (err) {
        this.$toast('获取数据失败,请稍后重试');
      }
    }
  },
  created () {
    if (this.user) {
      this.loadUserInfo();
    }
  },
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
        border: 4px solid #eee;
        border-radius: 50%;
        margin-bottom: 15px;
        object-fit: cover;
      }
      .text {
        font-size: 28px;
        color: #eee
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display:flex;
      justify-content: space-between;
      align-items: center;
      .left-info {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #eee;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.confont {
        font-size: 45px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .mb-4 {
    margin-bottom: 4px;
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
}
</style>
