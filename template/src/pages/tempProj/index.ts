/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 19:35:43
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-08 17:01:33
 * @Description: file content
 * @FilePath: /cli/template/src/pages/tempProj/index.ts
 */
import { createApp } from 'vue';
import store from './store';
import App from './App.vue';
import axios from './http';

const app = createApp(App);

app.use(store);
app.mount('#rootApp');
app.config.globalProperties.$http = axios;

if ((module as any).hot) {
	console.log('开发环境，启用热加载更新！');
	(module as any).hot.accept();
}
