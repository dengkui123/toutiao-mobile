<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
      <van-icon
        v-show="isEdit && !fixedChannels.includes(channel.id)"
        slot="icon"
        name="clear"
      ></van-icon>
      <!-- 条件绑定处理样式 -->
      <span
        class="text"
        :class="{ active: index === active }"
        slot="text"
      >{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑状态的显示
      fixedChannels: [0], // 不允许被删除
    }
  },
  watch: {},
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    },
    //   const channels = [];
    //   this.allChannels.forEach(channel => {
    //     const res = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id;
    //     })
    //     if (!res) {
    //       channels.push(channel);
    //     }
    //   });
    //   return channels;
    // }
  },
  methods: {
    // 获取全部频道
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        console.log(data);
        this.allChannels = data.data.channels;
      } catch (err) {
        this.$toast('数据获取失败');
      }
    },
    // 添加频道
    async onAddChannel(channel) {
      this.myChannels.push(channel);
      try {
        if (this.user) {
          addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } else {
          setItem('TOUTIAO_CHANNELS', this.myChannels);
        }
      } catch (err) {
        this.$toast('保存失败,请稍后重试');
      }
    },
    // 选择/删除频道
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        if (this.fixedChannels.includes(index)) {
          return
        }
        this.myChannels.splice(index, 1);
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1);
        }
        // 处理持久化、删除频道
        this.deleteChannel(channel);
      } else {
        // 切换频道
        this.$emit('update-active', index, false);
      }
    },
    // 删除频道
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录
          await deleteUserChannel(channel.id)
        } else {
          // 未登录
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败,请稍后重试')
      }
    }
  },
  created () {
    this.loadAllChannels();
  },
  mounted () {},
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 24px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
