/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-08 16:51:39
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-08 17:02:18
 * @Description: file content
 * @FilePath: /cli/template/src/pages/tempProj/http/index.ts
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 请求拦截
axios.interceptors.request.use((config: AxiosRequestConfig) => {
	return config;
});

// 响应拦截
axios.interceptors.response.use(
	(response: AxiosResponse<any>) => {
		return response;
	},
	(error: any) => {
		return Promise.reject(error);
	}
);

export default axios;
