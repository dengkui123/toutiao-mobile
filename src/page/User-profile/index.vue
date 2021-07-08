<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    />
    <input
      ref="file"
      type="file"
      hidden
      @change="onFileChange"
    >

    <!-- 个人信息 -->
    <van-cell
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image
        class="avatar"
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
      />
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    />

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%;"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>
     <!-- 编辑性别 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
      />
    </van-popup>

    <!-- 编辑生日 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
        v-if="isUpdateBirthdayShow"
        @close="isUpdateBirthdayShow = false"
        v-model="user.birthday"
      />
    </van-popup>

    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%"
    >
    <update-photo
      v-if="isUpdatePhotoShow"
      :img="img"
      @close="isUpdatePhotoShow = false"
      @update-photo="user.photo = $event"
    ></update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  props: {},
  data () {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null,
    }
  },
  watch: {},
  computed: {},
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile();
        console.log(data);
        this.user = data.data;
      } catch (err) {
        this.$toast('数据获取失败');
      }
    },

    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0];
      if (file.size > 102400) {
        this.$toast.fail('图片过大，请压缩后重新上传');
        this.$refs.file.value = '';
        return
      }
      // 基于文章对象获取 blob数据
      this.img = window.URL.createObjectURL(file);
      this.isUpdatePhotoShow = true;

      // 为了使同名文件也能触发change事件
      // 每次使用完毕清空value
      this.$refs.file.value = '';
    }
  },
  created () {
    this.loadUserProfile();
  },
  mounted () {},
}
</script>

<style lang="less" scoped>
.user-profile {
  .avatar {
     width: 60px;
     height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
