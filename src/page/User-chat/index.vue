<template>
  <div class="user-chat">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="小智同学">
      <van-icon
        slot="left"
        name="arrow-left"
        @click="$router.back()"
      ></van-icon>
    </van-nav-bar>
    <!-- 聊天列表 -->
    <van-cell-group class="list-wrap">
      <van-cell v-for="i in 20" :key="i" title="单元格">
      </van-cell>
    </van-cell-group>
    <!-- 输入框 -->
    <van-cell-group class="send-message-wrap">
      <van-field
        v-model="message"
        :border="false"
      />
      <van-button
        type="info"
        size="small"
        class="btn"
      >发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import io from 'socket.io-client'

// 建立连接
const socket = io('http://ttapi.research.itcast.cn')

socket.on('connect', function() {
  console.log('连接建立成功了')
});
// 断开连接了
// socket.on('disconnect', function() {
//   console.log('断开连接了')
// });

window.socket = socket;
// 发送消息
// socket.emit('消息类型'，消息内容)
// socket.on('消息类型',function(data) {data消息})

export default {
  name: 'UserChat',
  components: {},
  props: {},
  data () {
    return {
      message: '',
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
.list-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  overflow-y: auto;
}
.send-message-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 0 14px;
  align-items: center;
  .van-button__content {
    width: 50px;
  }
}

</style>
