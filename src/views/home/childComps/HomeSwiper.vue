<template>
  <swiper>
    <!-- 遍历banners数组 生成多个SwiperItem -->
    <swiper-item v-for="item in banners" :key="item.id">
      <a :href="item.link">
        <!-- 每加载完一张图片就执行函数imageLoad -->
        <img :src="item.image" alt="" @load="imageLoad" />
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "HomeSwiper",
  // 接收父组件传过来的banners数组
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // 设置关闭的变量
      isLoad: false,
    };
  },
  components: {
    Swiper,
    SwiperItem,
  },
  methods: {
    imageLoad() {
      // 只需要加载一张轮播图就可以发送自定义事件 因为每张轮播图高度都相同
      if (!this.isLoad) {
        this.$emit("swiperImageLoad");
        this.isLoad = true;
      }
    },
  },
};
</script>

<style scoped>
</style>
