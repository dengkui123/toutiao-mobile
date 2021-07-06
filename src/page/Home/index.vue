<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs
      class="van-tabs"
      v-model="active"
      animated
      swipeable
    >
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <article-list :channel="channel" />
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
      <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
       close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false // 控制编辑频道弹出层的显示状态
    }
  },
  watch: {},
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async loadChannels () {
      try {
        let channels = [];
        if (this.user) {
          const { data } = await getUserChannels();
          channels = data.data.channels
        } else {
          // 未登录
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            channels = localChannels;
          } else {
            // 没有本地数据,请求默认频道列表
            const { data } = await getUserChannels();
            channels = data.data.channels
          }
        }
        this.channels = channels;
        // const { data } = await getUserChannels();
        // this.channels = data.data.channels;
      } catch (err) {
        this.$toast('获取频道数据失败');
      }
    },
    onUpdateActive(index, isChannelEditShow = true) {
      this.active = index;
      this.isChannelEditShow = isChannelEditShow;
    }
  },
  created () {
    this.loadChannels();
  },
  mounted () {},
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 174px 0 100px;
  .page-nav-bar{
     /deep/ .van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon {
        font-size: 32px;
      }
    }
  }
  /deep/ .van-tabs {
    .van-tabs__wrap {
      height: 82px;
      top: 92px;
      left: 0;
      right: 0;
      position: fixed;
      z-index: 1;
    }
    &__nav {
      padding-bottom: 0;
    }
    &__line {
        width: 31px;
        height: 6px;
        background-color: #3296fa;
        bottom: 8px;
      }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
      &--active {
        color: #333;
      }
    }
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.iconfont {
        font-size: 33px;
      }
      &::before {
        position: absolute;
        left: 0;
        content: "";
        width: 1px;
        height: 80%;
        background-image: linear-gradient(#fff,#999,#fff);
      }
    }
  }
}
</style>
