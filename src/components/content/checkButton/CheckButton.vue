<template>
  <div class="check-button" :class="{ check: isChecked }">
    <img src="~assets/img/cart/tick.svg" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    isChecked: {
      type: Boolean,
      default: true,
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.check-button {
  width: 22px;
  height: 22px;
  /* 内部图片居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 2px solid #aaa;
}
.check {
  background-color: red;
  border-color: red;
}
</style>