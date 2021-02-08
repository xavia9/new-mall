<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item
        v-for="item in cartList"
        :key="item.iid"
        :item-info="item"
      />
    </scroll>
  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";

import { mapGetters } from "vuex";
import CartListItem from "./cartListItem.vue";

export default {
  data() {
    return {};
  },
  components: {
    Scroll,
    CartListItem,
  },
  computed: {
    ...mapGetters(["cartList"]),
  },
  activated() {
    this.$refs.scroll.refresh();
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
.content {
  overflow: hidden;
  /* 减去底部的导航栏和顶部的navbar和底部的工具栏 */
  height: calc(100vh - 93px - 40px);
}
</style>