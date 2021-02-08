<template>
  <div class="goods">
    <!-- 使用GoodsListItem子组件 -->
    <!-- 1.遍历goods数组生成多个子组件 -->
    <!-- 2.将item传递给子组件 -->
    <goods-list-item v-for="item in goods" :key="item.id" :goods-item="item" />
  </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem";

export default {
  name: "GoodsList",
  components: {
    GoodsListItem,
  },
  // 接收父组件传过来的goods数组
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 2px;
  /* background-color: #fff; */
}
</style>
