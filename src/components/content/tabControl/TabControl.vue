<template>
  <div class="tab-control">
    <!-- 一、接收传递过来的titles数组 并对其进行遍历 其item就是控制条的小标题 -->
    <!-- 二、点击每个tab-control-item 将每个item对应的index传给itemClick函数 1.该函数将index赋值给currentIndex 2.通过自定义函数tabClick将index传给父组件 -->
    <!-- 三、绑定动态样式active 当currentIndex===index结果为true时 给对应的tab-control-item绑定样式 -->
    <div
      v-for="(item, index) in titles"
      :key="item"
      class="tab-control-item"
      :class="{ active: index === currentIndex }"
      @click="itemClick(index)"
    >
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      this.$emit("tabClick", index);
    },
  },
};
</script>

<style scoped>
.tab-control {
  display: flex;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 15px;
  background-color: #fff;
}

.tab-control-item {
  flex: 1;
}

.tab-control-item span {
  padding: 5px;
}

.active {
  color: var(--color-high-text);
}

.active span {
  border-bottom: 3px solid var(--color-tint);
}
</style>
