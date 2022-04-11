/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-11 12:39:18
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-11 15:55:02
 * @Description: file content
 * @FilePath: /newProject/src/pages/tempProj/test/App.spec.ts
 */
import { shallowMount } from '@vue/test-utils';
import App from '../App.vue';

describe('App.vue', () => {
	it('test app contain', () => {
		const wrapper = shallowMount(App as any, {});
		expect(wrapper.html()).toContain('组件示例');
	});
});
