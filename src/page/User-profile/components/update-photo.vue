<template>
<div class="update-photo">
  <img ref="img" class="img" :src="img">
  <div class="toolbar">
    <div class="cancel" @click="$emit('close')">取消</div>
    <div class="confirm" @click="onConfirm">完成</div>
  </div>
</div>
</template>

<script>
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true,
    }
  },
  data () {
    return {
      cropper: null,
    }
  },
  watch: {},
  computed: {},
  methods: {
    onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });
      // console.log(this.cropper.getData());
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob);
      });
    },
    async updateUserPhoto(blob) {
      try {
        // updateUserPhoto({
        //   photo: blob
        // })
        // 如果接口要求 Content-Type 是 application/json
        // 则传递普通 JavaScript 对象
        // 如果接口要求 Content-Type 是 multipart/form-data
        // 则必须传递 FormData 对象
        const formData = new FormData();
        // Pass the image file name as the third parameter if necessary.
        formData.append('photo', blob);
        const { data } = await updateUserPhoto(formData);
        console.log(data);
        this.$emit('close');
        this.$emit('update-photo', data.data.photo);
        this.$toast.success('更新成功');
      } catch (err) {
        this.$toast.fail('更新失败');
      }
    }
  },
  created () {},
  mounted () {
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1, // 裁剪框的范围 0可以拖出区域，1只能在画布中拖动
      dragMode: 'move', // 拖动模式
      aspectRatio: 1, // 裁切比例
      autoCropArea: 1, // 自动裁切尺寸 1代表最大
      cropBoxMovable: false, // 截图区域是否可以移动
      cropBoxResizable: false, // 截图区域是否可以缩放
      background: false, // 背景
      movable: true // 背景是否可以移动默认为true
    });
  },
}
</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .img {
    max-width: 100%;
    display: block;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel, .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}

</style>
