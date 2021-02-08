<template>
  <div class="bottom-bar">
    <check-button
      :is-checked="isSelectAll"
      class="check-button"
      @click.native="checkClick"
    />
    <span>全选</span>
    <div class="total">合计：{{ totalPrice }}</div>
    <div class="calculate">去结算{{ checkLength }}</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton.vue";

import { mapGetters } from "vuex";

export default {
  components: { CheckButton },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["cartList"]),
    // 1.筛选出选中的商品 2.将商品数量和价格相乘并累加 3.保留两位小数
    totalPrice() {
      return (
        "￥" +
        this.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    //  1.筛选出选中的商品  2.将商品数量累加
    checkLength() {
      return this.cartList
        .filter((item) => {
          return item.checked;
        })
        .reduce((preValue, item) => {
          return preValue + item.count;
        }, 0);
    },
    // 何时全选的情况
    isSelectAll() {
      // 1.如果购物车为空 则返回false
      if (this.cartList.length == 0) {
        return false;
      }

      // 2.只要有一个没选上 就返回true filter函数返回的数组就有了长度
      // 不要忘记加上return
      return !this.cartList.filter((item) => {
        return !item.checked;
      }).length;

      //   return !this.cartList.find((item) => !item.checked);

      for (let item of this.cartList) {
        if (!item.checked) {
          return item.checked;
        }
      }
      return false;
    },
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        this.cartList.forEach((item) => (item.checked = false));
      } else {
        this.cartList.forEach((item) => (item.checked = true));
      }
      // 这种方法不可行 因为item.checked会受isSelectAll的值影响 而isSelectAll的取值又会受item.checked影响
      // this.cartList.forEach((item) => (item.checked = !this.isSelectAll));
    },
  },
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.bottom-bar {
  height: 40px;
  /* background-color: red; */
  display: flex;
  /* justify-content: center; */
  align-items: center;
  /* margin: 5px; */
}
.check-button {
  width: 18px;
  height: 18px;
  margin: 0 15px 0 15px;
}
.total {
  margin: 0 20px 0 20px;
}
.calculate {
  position: absolute;
  right: 0;
  line-height: 40px;
  padding: 0 10px;
  background-color: pink;
}
</style>