// 引入防抖节流函数
import { debounce } from "common/utils";
//返回顶部组件
import BackTop from "components/content/backTop/BackTop";

// 采用混入将组件中具有的共同的data mounted methods components抽离 但是组件中仍然可以使用自身的data mounted methods components 需要用到公共部分时在组件中导入即可
// Home组件和Detail组件都需要监听图片加载完毕后刷新 因此使用混入
export const itemListenerMixin = {
  // refresh定义在data中 下面不管赋值多少次都不会占用太多内存
  data() {
    return { itemImgListener: null, refresh: null };
  },
  mounted() {
    // 1.调用debounce函数 并将结果赋值给data中的refresh变量
    //debounce函数第一个参数是函数 第二个参数是毫秒数
    this.refresh = debounce(this.$refs.scroll.refresh, 50);

    // 2.给itemImgListener变量赋值一个函数
    this.itemImgListener = () => {
      this.refresh();
    };

    // 3.调用全局事件
    // 第一个参数是全局事件名字 第二个参数是回调函数名字
    this.$bus.$on("itemImageLoad", this.itemImgListener);
    // console.log("我是mixin");
  }
  // 还可以引入其他
  //   methods: {},
  //   components: {}
};

// BackTop组件相关事件
export const backTopMixin = {
  // 引入组件
  components: { BackTop },
  data() {
    return { isShowBackTop: false };
  },
  methods: {
    // 回到顶部事件 调用scroll组件的scrollTo方法
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    listenShowBackTop(position) {
      // 按钮什么时候显示
      // 滚动到-1000的位置就显示
      this.isShowBackTop = -position.y > 1000;
    }
  }
};
