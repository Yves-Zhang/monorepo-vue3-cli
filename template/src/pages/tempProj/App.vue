<!--
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 20:17:06
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-07 18:06:18
 * @Description: file content
 * @FilePath: /temptate/src/pages/sv/App.vue
-->
<template>
  <div class="appContent">
    <div>组件示例</div>
    <div>{{ count }}</div>
    <div class="btn" @click="handleClick">按钮</div>
  </div>
</template>
 
<script lang="ts">
import { defineComponent } from "vue";
import "./app.less";

export default defineComponent({
  name: "App",
  components: {},
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    handleClick() {
      this.count++;
    },
  },
});
</script>