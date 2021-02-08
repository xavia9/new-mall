<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  // 接收父组件传过来的probeType和pullUpLoad 因为这两个功能不是每个页面都需要的 因此默认值为0和flase 需要功能时 再由父组件传递数值过来开启功能即可！！！
  // probeType决定是否实时监听位置
  // pullUpLoad决定是否上拉加载更多
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
      message: "哈哈哈",
    };
  },
  // 要想拿到$refs.wrapper 必须放在mounted时期
  mounted() {
    // 1.创建BScroll对象 并且将该对象赋值给scroll
    this.scroll = new BScroll(this.$refs.wrapper, {
      // 设置插件的属性
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    });

    // 2.监听滚动的位置
    // 判断只有probeType为2和3的时候插件scroll才能实时监听滚动
    if (this.probeType === 2 || this.probeType === 3) {
      //只要内容在滚动 就会发送scroll自定义事件给父组件 并将当前滚动到的位置一起传过去
      this.scroll.on("scroll", (position) => {
        // console.log(position);
        this.$emit("scroll", position);
      });
    }

    // 3.监听scroll滚动到底部
    // 判断只有pullUpLoad为true时 滚动到最底部才可以监测到
    if (this.pullUpLoad) {
      // 内容滚动到最底部时 发送自定义事件给父组件 让父组件加载更多数据
      this.scroll.on("pullingUp", () => {
        // console.log("--------");
        this.$emit("pullingUp");
      });
    }
  },
  methods: {
    // 使用场景：1.配合BackTop组件的返回顶部功能  2.从详情页返回首页 或者从其他功能页回到首页时 回到之前浏览的位置
    scrollTo(x, y, time = 300) {
      //为了避免scroll没有加载
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    // 重新刷新scroll
    refresh() {
      // console.log("refresh...");
      // 先判断scroll加载出来了再调用该方法
      this.scroll && this.scroll.refresh();
    },
    // 必须有，如果没有就只能进行一次下拉加载
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    // 用于获取页面滚动位置
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
    },
  },
};
</script>

<style scoped>
</style>
