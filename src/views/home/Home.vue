<template>
  <div id="home" class="wrapper">
    <!-- 首页顶部导航栏 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!-- 首页商品分类控制条 一开始隐藏 页面滚动到某个位置后就会显示出来 并且固定在一个位置 -->
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <!-- 滚动内容区域 -->
    <!-- 必须给scroll外壳设置一个固定的高度才能让内容在这个高度范围内滚动 所以加上一个content类名 -->
    <!-- 传递probeType参数给Scroll组件 开通实时监听内容滚动功能 -->
    <!-- 接收Scroll组件传过来的scroll方法 该方法会调用contentScroll函数 用来监听页面滚动到什么位置 用于决定BackTop组件和TabControl1什么时候显示 -->
    <!-- 传递pullUpLoad参数给Scroll组件 开通相应功能(监测内容是否滑到底部) -->
    <!-- 接收Scroll组件传过来的pullingUp方法 该方法会调用loadMore函数 loadMore函数会去请求更多数据来展示载页面 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="2"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!-- 轮播图 -->
      <!-- 1.将data中的banners数组传给HomeSwiper组件 2.接收HomeSwiper组件传回来的函数 -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <!-- 推荐商品 将data中的recommends数组传给RecommendView组件 -->
      <recommend-view :recommends="recommends" />
      <feature-view />
      <!-- 第二个控制条 将数组titles传给TabControl组件 让组件展示内容和样式 -->
      <!-- 接收TabControl组件传递过来的tabClick方法和index -->
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <!-- 商品列表 -->
      <!-- 将计算属性 this.goods[this.currentType].list的结果传给GoodList组件 -->
      <good-list :goods="showGoods" />
    </scroll>
    <!-- 返回顶部按钮 -->
    <!-- 1.点击时调用backClick函数 该函数会让页面回到顶部  2.isShowBackTop会根据一个表达式得到true或者false 然后决定该组件是否显示 -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
// 子组件
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

// 一般公共组件和项目公共组件
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
// import BackTop from "components/content/backTop/BackTop";

// 其他组件
import { getHomeMultidata, getHomeGoods } from "network/home";
// import { debounce } from "common/utils";
// 1.针对图片加载完毕后刷新scroll的防抖节流 2.点击按钮返回顶部
import { itemListenerMixin, backTopMixin } from "common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList,
    Scroll,
    // BackTop,
  },
  // 使用混入
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      // goods对象中又保存三个对象(pop/new/sell) 请求数据时需要按照不同种类/不同page去请求 每个对象里面又有page和list两个属性
      // page用来记录当前种类商品请求到了第多少页 页面初始化时和上拉加载更多都需要根据page去获取数据
      // list用来保存商品数据 将list传给GoodList组件 交由该组件展示
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isTabFixed: false,
      // 按钮默认不显示
      // isShowBackTop: false,
      saveY: 0,
      // 用于$bus.$off取消事件
      // itemImgListener: null,
    };
  },
  //页面渲染前调用methods中的网络请求函数
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },

  // 方法一
  // mounted() {
  //   // 1.图片加载完成的事件监听
  //   //请求同样的数据时 可以防止过快的向服务器请求数据
  //   //放在mounted内部 页面渲染完成 图片每加载一张就刷新一下
  //   const refresh = debounce(this.$refs.scroll.refresh, 50);
  //   this.$bus.$on("homeItemImgLoad", () => {
  //     refresh();
  //   });
  // },
  // 方法二 配合deactivated中的取消全局事件
  // mounted() {
  //   const refresh = debounce(this.$refs.scroll.refresh, 50);
  //   this.itemImgListener = () => {
  //     refresh();
  //   };
  //   this.$bus.$on("itemImageLoad", this.itemImgListener);
  // },
  // 方法三 采用混入 抽取公共部分 mixin.js中
  mounted() {
    // console.log("我是Home mounted");
  },

  //activated deactivated只有在<keep-alive></keep-alive>使用时才有效 两个经常配合一起使用
  // 恢复之前缓存的页面
  activated() {
    // 1.恢复页面之前滚动到的位置
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    // 2.回到首页时 刷新一下scroll确保插件重新计算高度
    this.$refs.scroll.refresh();
  },
  deactivated() {
    // 1.保存离开前页面滚动到哪个位置 并赋值给saveY 需要配合activated中的scrollTo使用
    this.saveY = this.$refs.scroll.getScrollY();
    // 2.取消全局事件监听 配合mounted中的图片监听使用 主要是为了防止
    // 第一个参数是监听的事件名字 第二个参数是需要取消的回调函数名字
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },

  computed: {
    // 该功能使用场景：1.tabControl切换时 currentType发生变化 2.上拉加载更多时list数组发生变化
    showGoods() {
      // 只要this.goods[this.currentType].list发生变化 就将结果传给组件GoodList展示
      return this.goods[this.currentType].list;
    },
  },
  /*事件监听相关的方法*/
  methods: {
    // 1.接收tabControl传递过来的index 根据index值的不同 修改data中的currentType 计算属性中的showGoods函数检测到currentType的变化就会及时更新组件GoodList的数据
    // 功能使用场景：切换tabControl1(或者tabControl2)时显示不同种类的商品
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 2.将组件tabControl1(或者组件tabControl2)传过来的index同时赋值给两个组件的currentIndex 确保点击不同的组件时样式可以相互同步
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    // 使用mixin混入供多个组件使用
    // backClick() {
    //   this.$refs.scroll.scrollTo(0, 0);
    // },
    //使用场景：1.页面滚动到1000时BackTop组件显示  2.检测页面滚动位置决定TabControl1什么时候显示
    contentScroll(position) {
      // 1.判断BackTop组件是否显示 当scroll传过来的position中的y值小于-1000时 说明页面已经滚动到了-1000的位置 将位置信息传给listenShowBackTop函数
      // this.isShowBackTop = -position.y > 1000;
      this.listenShowBackTop(position);

      // 2.决定tabControl1什么时候显示 需要和swiperImageLoad方法配合使用
      // 用当前滚动位置的纵坐标和tabOffsetTop比较 大于则isTabFixed为true 显示BackTop组件
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    // 调用网络请求方法 请求currentType类型的下一页数据
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    // 需要配合contentScroll方法使用 获取tabControl2距离#home顶部的距离 并且保存给data中的tabOffsetTop 再通过和-position.y比较 决定tabControl1什么时候显示
    // 因为tabControl2距离#home顶部的距离和中间的图片是否加载完成有关 而且主要和轮播图有关 因此需要等到轮播图在页面中渲染之后再使用offsetTop方法
    // $el因为只有在页面渲染出来后才能获取到
    swiperImageLoad() {
      // 使用offsetTop父元素必须具有非static定位
      // console.log(this.$refs.tabControl2.$el);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      // console.log(this.tabOffsetTop);
    },
    // 1.网络请求 获取轮播图和推荐数据
    getHomeMultidata() {
      // 首先赋值给data中的banners和recommends数组 再通过父子通信传给两个组件
      getHomeMultidata().then((res) => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    // 2.网络请求 需要传入一个变量 获取goods[type]下一页的数据
    //  首先更新data中的goods对象 接着再通过父子通讯传给GoodList组件
    // 调用该函数的情况：1.上拉加载更多时 2.首页初始化时
    getHomeGoods(type) {
      // 获取data中保存的goods对象中的page 并且在此基础上加1
      const page = this.goods[type].page + 1;
      // 传入两个变量type和page 获取数据
      getHomeGoods(type, page).then((res) => {
        // console.log(res);
        // 将获取到的数据push到data中的goods[type]对象中的list数组中 并且page加1
        // goods对象数据更新后 计算属性中的showGoods会检测到this.goods[this.currentType].list发生变化 然后将新的结果传给GoodList组件
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // goods数据请求完成后使用该函数 以便下一次上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动 使用fixed 但是scroll插件会给content加上translate 即使有fixed属性也会一起移动*/
  /* position: fixed; */
  /* 直接加上宽度 将scroll插件加在content外面 */
  width: 100%;
  /* left: 0; */
  /* right: 0; */
  /* top: 0; */
  /* z-index: 9; */
}

/* 方法一 让content脱标 tabControl1不脱标 */
/* .content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
} 
.tab-control {
  position: relative;
  z-index: 9;
}
*/

/* 1、当tabControl1不脱标显示出来的时候 content会被它挤到下面 tab-control2距离顶部的距离就不再是以#home为标准 而是以tab-control1为标准 因为tab-control1和tab-control2不重叠 因此视觉就不流畅
  2、为了避免这种问题 可以让tabControl1脱标 或者让content脱标 */
/* 方法二、tabControl1脱标 content不脱标 */
.content {
  height: calc(100% - 49px);
  overflow: hidden;
  /* margin-top: 44px; */
}
.tab-control {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 9;
}
</style>
