<template>
  <!-- 点击每个goods-item 就可以跳转到该商品详情页 -->
  <div class="goods-item" @click="itemClick">
    <!-- 1.绑定动态src 计算属性showImage会根据结果返回不同的数据 -->
    <!-- 2.每张图片加载完毕时调用imageLoad函数 -->
    <img :src="showImage" alt="" @load="imageLoad" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  // 接收GoodsList组件传递过来的goodsItem对象
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    showImage() {
      // 前者是Detail组件推荐商品信息 后者是Home组件中的推荐商品信息
      // 当前者无法取到时 就返回后者
      return this.goodsItem.image || this.goodsItem.show.img;
    },
  },
  methods: {
    // 监听每张图片加载完成时
    // 方法一 判断路由 根据不同地址 使用不同的事件总线 但是需要判断多次
    // imgload() {
    //   if (this.$route.path.indexOf("/home") !== -1) {
    //     this.$bus.$emit("homeItemImgLoad");
    //   } else if (this.$route.path.indexOf("/detail") !== -1) {
    //     this.$bus.$emit("detailItemImgLoad");
    //   }
    // },
    // 方法二 使用一个事件总线传给Detail和Home 但是组件离开时取消 组件恢复时继续使用 然后及时刷新
    imageLoad() {
      this.$bus.$emit("itemImageLoad");
    },
    // 路由跳转 网络请求时为了区分每个商品 需要跟上iid参数
    itemClick() {
      this.$router.push("/detail/" + this.goodsItem.iid);
    },
  },
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;

  width: 48%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
