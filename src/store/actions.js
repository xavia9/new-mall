import { ADD_COUNTER, ADD_TO_CART } from "./mutation-types";

export default {
  addCart(context, payload) {
    // 比较iid 查找出符合的数据 放入oldProduct数组中
    let oldProduct = context.state.cartList.find(
      item => item.iid == payload.iid
    );

    // 2.判断oldProduct
    if (oldProduct) {
      // oldProduct.count += 1;
      context.commit(ADD_COUNTER, oldProduct);
    } else {
      payload.count = 1;
      // context.state.cartList.push(payload);
      context.commit(ADD_TO_CART, payload);
    }
  }
};
