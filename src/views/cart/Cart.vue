<template>
  <div class="cart">
    <!-- 导航栏 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ length }})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list />
    <!-- 购物车界面导航栏 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList.vue";
import CartBottomBar from "./childComps/CartBottomBar";

import { mapGetters } from "vuex";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar,
  },
  computed: {
    // 将Vuex中的
    // cartLength(state) {
    //   return this.$store.getters.cartLength;
    // },
    // 用法一
    // ...mapGetters(["cartLength", "cartList"]),
    // 用法二 使用新的命名
    ...mapGetters({
      length: "cartLength",
      list: "cartList",
    }),
  },
};
</script>

<style scoped>
.cart {
  /* 减去底部的导航栏 */
  height: calc(100vh - 49px);
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
