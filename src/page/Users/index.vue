<template>
  <div class="user-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      :title="userInfo.name">
      <van-icon
        slot="left"
        name="arrow-left"
        @click="$router.back()"
      ></van-icon>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 用户信息 -->
    <div class="user-info-container">
      <div class="row1">
        <van-image
          class="col1"
          fit="cover"
          round
          :src="userInfo.photo"
        />
        <div class="col2">
          <div class="row1">
            <div class="item">
              <div class="count">{{ userInfo.art_count }}</div>
              <div class="text">发布</div>
            </div>
            <div class="item">
              <div class="count">{{ userInfo.follow_count }}</div>
              <div class="text">关注</div>
            </div>
            <div class="item">
              <div class="count">{{ userInfo.fans_count }}</div>
              <div class="text">粉丝</div>
            </div>
            <div class="item">
              <div class="count">{{ userInfo.like_count }}</div>
              <div class="text">获赞</div>
            </div>
          </div>
          <div class="action">
            <van-button
              v-if="userInfo.is_followed"
              class="follow-btn"
              round
              size="small"
              :loading="loading"
              @click="onFollow"
            >已关注</van-button>
            <van-button
              v-else
              class="follow-btn"
              type="info"
              color="#3296fa"
              round
              size="small"
              :loading="loading"
              @click="onFollow"
            >关注</van-button>
          </div>
        </div>
      </div>
      <van-divider />
      <div class="intro-wrap">
        <div v-if="userInfo.is_media" class="item">
          <span class="title">认证：</span>
          <span class="text">用户的认证信息</span>
        </div>
        <div class="item">
          <span class="title">简介：</span>
          <span class="text">{{ userInfo.intro }}</span>
        </div>
      </div>
      <van-divider />
    </div>
    <!-- /用户信息 -->

    <!-- 文章列表 -->
    <div
      class="article-list"
      v-for="(article,index) in list"
      :key="index"
    >
      <div class="msg">
        <van-image
          class="col1"
          fit="cover"
          round
           width="40"
          height="40"
          :src="userInfo.photo"
        />
        <div class="row">
          <span class="row1">{{ userInfo.name }}</span>
          <span class="row2">{{ article.pubdate | localFormat}}</span>
        </div>
      </div>
      <article-item
        :article="article"
        :user-info="userInfo"
      />
       <van-divider />
    </div>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getUsersInfo, getUserArticleById, addFollow, delFollow } from '@/api/user.js'
import ArticleItem from '@/components/article-item'

export default {
  name: 'UserPage',
  components: {
    ArticleItem,

  },
  props: {
    userId: {
      type: [Number, String],
      required: true,
    }
  },
  data () {
    return {
      userInfo: {},
      list: [],
      loading: false, // 关注按钮的 loading 状态
    }
  },
  computed: {},
  watch: {},
  methods: {
    async loadUserInfo() {
      try {
        const { data } = await getUsersInfo(this.userId);
        this.userInfo = data.data;
        console.log(data);
      } catch (err) {
        this.$toast.fail('加载失败');
      }
    },
    async loadUserArticle() {
      try {
        const { data } = await getUserArticleById(this.userId);
        console.log(data);
        this.list = data.data.results;
      } catch (err) {
        console.log('加载失败');
      }
    },
    async onFollow() {
      this.loading = true;
      try {
        if (this.userInfo.is_followed) {
          // 已关注，取消关注
          await delFollow(this.userId);
        } else {
          // 没有关注，添加关注
          await addFollow(this.userId);
        }
        // this.article.is_folloed = !this.article.is_folloed;
        // this.$emit('update-is_followed', !this.value);
      } catch (err) {
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message);
      }
      this.loading = false;
    }
  },
  created () {
    this.loadUserInfo();
    this.loadUserArticle();
  },
  mounted () {},
}
</script>

<style scoped lang="less">
.user-container {
  font-size: 28px;
  .user-info-container {
    padding: 24px;
    background-color: #fff;
    margin-bottom: 0px;
    >.row1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 60px;
      .item {
        text-align: center;
        .text {
          font-size: 24px;
        }
      }
      >.col1 {
        width: 160px;
        height: 160px;
      }
      >.col2 {
        display: flex;
        flex-direction: column;
        justify-content:space-between;
        width: 70%;
        height: 160px;
        padding: 0 24px;
        >.row1 {
          display: flex;
          justify-content: space-between;
          .count {
            font-weight: 600;
            color: #333;
          }
          .text {
            color: #999;
          }
        }
        .action {
          display: flex;
          justify-content: center;
          .van-button {
            width: 288px;
            height: 60px;
            border: none;
            border-radius: 10px;
            background-color:#81BEF7;
          }
        }
      }
    }
    .van-divider {
      box-shadow: 0 2px 5px 0;
      margin-left: -20px;
      margin-right: -20px;
    }
    .intro-wrap {
      .item {
        padding:10px 0;
        .title {
          color: #666;
        }
        .text {
          color: #333;
        }
      }
    }
  }
  .article-list {
    .msg {
      display: flex;
      justify-content:left;
      align-items: center;
      background-color: #fff;
      padding: 35px 0 0 35px;
    }
    .col1 {
      margin-right: 50px;
    }
    .row {
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content:space-between;
      .row1 {
        color: #000;
        font-size: 28px;
      }
      .row2 {
        color: #999;
        font-size: 16px;
      }
    }
    .van-divider {
      margin: 0;
      box-shadow: 0 0 5px;
    }
  }
}
</style>
