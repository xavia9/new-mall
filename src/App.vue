<template>
  <div id="app" class="wrapper">
    <!-- 使被包含的组件保留状态 或避免重新渲染 也就是所谓的组件缓存 但是这里不需要缓存Detail组件信息 因为商品太多占内存大 -->
    <keep-alive exclude="Detail">
      <router-view />
    </keep-alive>
    <main-tab-bar />
  </div>
</template>

<script>
import MainTabBar from "components/content/mainTabbar/MainTabBar";

export default {
  name: "app",
  components: {
    MainTabBar,
  },
};
</script>

<style>
@import "assets/css/base.css";
</style>
