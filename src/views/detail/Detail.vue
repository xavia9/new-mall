<template>
  <div id="detail">
    <!-- 事件：区分大小写 -->
    <detail-nav-bar ref="nav" class="detail-nav" @titleClick="titleClick" />
    <!-- probe-type前面必须加：不然传过去就是一个字符串3 为了让返回顶部按钮功能 因此 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <!-- 属性：不区分大小写 topImages 传入值：top-images -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <!-- 商品展示图片加载完成后需要监听图片加载完成 -->
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" ref="params" />
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <!-- 需要监听图片加载完成后刷新 -->
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <detail-bottom-bar @addCart="addToCart" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

// 网络请求数据
import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
    GoodsList,
    DetailBottomBar,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      // 用于$bus.$off取消事件
      // itemImgListener: null,
      // 保存参数、评论、推荐对应模块的offsetTop
      themeTopYs: [],
      // 获取对应模块的offsetTop的防抖函数
      getThemeTopY: null,
      currentIndex: 0,
    };
  },
  methods: {
    // 1.1 子组件图片加载完后发送事件刷新
    // imageLoad() {
    // this.$refs.scroll.refresh();
    // },
    // 1.2 采用混入mixin
    imageLoad() {
      // console.log("--------------");

      this.refresh();

      // 方法四 当图片每次加载完成后就获取一次 $el.offsetTop 但是每张图片加载完成就会获取一次 效能不高
      // this.themeTopYs = [];
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      // 采用防抖节流方法获取子组件的offsetTop
      this.getThemeTopY();
    },
    // 2.点击DetailNavBar跳转到参数、评论、推荐对应模块
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      // console.log(position);
      // 1.滚动位置和DetailNavBar位置对应
      // 获取y值
      const positionY = -position.y;
      // 2.positionY和主题中的值进行对比
      // 0 <= positionY < themeTopYs[1] 那么DetailNavBar显示第一个
      // themeTopYs[1] <= positionY < themeTopYs[2] 那么DetailNavBar显示第二个
      // themeTopYs[2] <= positionY < themeTopYs[3] 那么DetailNavBar显示第三个
      // themeTopYs[3] <= positionY 那么DetailNavBar显示第四个

      // for (let i in this.themeTopYs) {
      // console.log(i); // 此处的i是字符串 因此i+1是字符串拼接
      // 不可行 会从最小的开始判断
      // if (positionY > this.themeTopYs[i]) {
      // 不可行 最后一个数值无法判断
      // if (positionY < this.themeTopYs[i + 1]) {
      // console.log(i);
      // }
      // }

      // 方法一：普通方法
      // let length = this.themeTopYs.length;
      // // 1.不断检测i处于哪个区间
      // for (let i = 0; i < length; i++) {
      //   // 2.positionY必须满足大于某个值且小于某个值的时候才能打印i 否则仅满足单边小于的会将小于i的值也打印出来
      //   // 3.为了防止赋值过于频繁 使用this.currentIndex !== i && 判断语句
      //   if (
      //     this.currentIndex !== i &&
      //     ((i < length - 1 &&
      //       positionY >= this.themeTopYs[i] &&
      //       positionY < this.themeTopYs[i + 1]) ||
      //       (i === length - 1 && positionY >= this.themeTopYs[i]))
      //   ) {
      //     this.currentIndex = i;
      //     // console.log(this.currentIndex);
      //     this.$refs.nav.currentIndex = this.currentIndex;
      //   }
      // }

      // 方法二：hack方法
      // 在created中getThemeTopY函数内给数组themeTopYs再加一个值
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        // 虽然最大值占内存 但是if判断条件减少会提高性能
        // 不能采用 this.themeTopYs[i] <= positionY < this.themeTopYs[i + 1] 的写法
        if (
          this.currentIndex !== i &&
          this.themeTopYs[i] <= positionY &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      // 2.判断BackTop是否显示 当scroll传过来的position中的y值小于-1000时 说明页面已经滚动到了-1000的位置
      // this.isShowBackTop = -position.y > 1000;
      this.listenShowBackTop(position);
    },
    addToCart() {
      // console.log("Detail组件 购物车");
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      // 有的商品价格是个区间 因此购物车需要获取另外的价格
      product.price = this.goods.realPrice;
      // 必须添加iid 让后台通过iid知道购买的哪件商品
      product.iid = this.iid;

      //2.将商品添加到购物车
      //不要直接改变数据
      // this.$store.cartList.push(product);
      // this.$store.commit("addCart", product);
      this.$store.dispatch("addCart", product);
    },
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求Detail页面数据
    getDetail(this.iid).then((res) => {
      //   console.log("Detail组件请求的数据：", res);
      // 1.获取数据
      const data = res.result;
      // 2.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages;

      // 3.获取商品信息 创建商品对象
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 5.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 6.获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 7.取出评论信息 判断有无评论
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // 方法三 获取数据的回调中也不行 DOM没有渲染完 拿不到$refs
      // this.themeTopYs = [];
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // console.log(this.themeTopYs);

      // 方法四 此时可以使用nextTick等到子组件DOM都渲染完成 $el都有数值了 再执行内部的回调函数 但是nextTick不能等到图片都加载完成 因此获取的offsetTop有误差
      // this.$nextTick(() => {
      //   this.themeTopYs = [];
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // });
    });

    // 3.请求推荐数据
    getRecommend().then((res) => {
      // console.log("Detail组件请求的推荐商品数据", res);
      this.recommends = res.data.list;
    });

    // 方法五 给getThemeTopY赋值（对this.getThemeTopY赋值的操作进行防抖） 然后在
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);

      // console.log(this.themeTopYs);
    }, 100);

    // 方法一 放在created 但是此时压根不能获取到元素
    // this.themeTopYs = [];
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
  },

  // 方法一
  // mounted() {
  //   //请求同样的数据时 可以防止过快的向服务器请求数据
  //   const refresh = debounce(this.$refs.scroll.refresh, 50);
  //   this.$bus.$on("detailItemImgLoad", () => {
  //     refresh();
  //   });
  // },
  // 方法二
  // mounted() {
  //   //请求同样的数据时 可以防止过快的向服务器请求数据
  //   const refresh = debounce(this.$refs.scroll.refresh, 50);
  //   this.itemImgListener = () => {
  //     refresh();
  //   };
  //   this.$bus.$on("itemImageLoad", this.itemImgListener);
  // },
  // 抽取到混入mixin.js中
  mounted() {
    // 方法二 因为created里面才开始异步请求数据 因此子组件在没有接收到数据时就不会显示根组件 因此没有办法获取到子组件的offsetTop
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    // console.log(this.themeTopYs);
  },
  updated() {
    // updated更新太频繁 此方法不佳
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    // console.log(this.themeTopYs);
  },
  // Dtail组件没有使用<keep-alive></keep-alive>因此只能使用destroyed
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  height: 100vh;
  background-color: #fff;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

/* content多减去一个工具栏的高度49px 这样滚动的时候就可以完全显示出商品内容 */
.content {
  /* 方法一 不脱标 */
  /* height: calc(100% - 44px); */
  height: calc(100vh - 93px);
  /* 不加overflow 导航栏也会跟着一起走 */
  overflow: hidden;

  /* 方法二 脱标 */
  /* position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 49px;
  overflow: hidden;*/
}
</style>
