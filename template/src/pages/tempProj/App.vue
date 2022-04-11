<!--
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 20:17:06
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-11 15:44:44
 * @Description: file content
 * @FilePath: /newProject/src/pages/tempProj/App.vue
-->
<template>
  <div class="appContent">
    <div>{{title}}</div>
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
      title: "组件示例",
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