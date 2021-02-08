import { ADD_COUNTER, ADD_TO_CART } from "./mutation-types";
export default {
  // addCart(state, payload) {
  //直接添加 不会判断之前是否添加过同类商品
  //   state.cartList.push(payload);
  //数组常用方法：push/pop/unshift/shift/sort/reverse/map/filter/reduce/join
  //mutations唯一的目的就是修改state中状态 mutations的每个方法尽可能完成的事件比较单一 但是如果采用if语句可能就会执行两个操作 因此将该函数放到actions里面
  //payload新添加的商品
  // 方法一
  // 1.查找之前数组中是否有该商品
  //   let oldProduct = null;
  //   for (let item of state.cartList) {
  //     if (item.iid === payload.iid) {
  //       // 浅拷贝 仍然指向cartList 因此修改oldProduct.count的时候就是修改该item的count！！！！
  //       oldProduct = item;
  //     }
  //   }
  // 2.判断oldProduct
  // if (oldProduct) {
  //   oldProduct.count += 1;
  // } else {
  //   payload.count = 1;
  //   state.cartList.push(payload);
  // }
  // 方法二
  // let oldProduct = state.cartList.find(item => item.iid == payload.iid);
  // if (oldProduct) {
  //   oldProduct.count += 1;
  // } else {
  //   payload.count = 1;
  //   state.cartList.push(payload);
  // }
  // }

  [ADD_COUNTER](state, payload) {
    payload.count++;
  },
  [ADD_TO_CART](state, payload) {
    // 放在push前面 添加checked属性
    // checked为true表示加到购物车时的默认是勾选状态
    payload.checked = true;
    state.cartList.push(payload);
  }
};
