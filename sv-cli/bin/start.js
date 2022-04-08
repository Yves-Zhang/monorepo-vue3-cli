#!/usr/bin/env node
/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 18:59:44
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-08 11:10:45
 * @Description: file content
 * @FilePath: /cli/sv-cli/bin/start.js
 */

const chalk = require('chalk');
const express = require('express'); //引入express
const webpack = require('webpack');
const config = require('../webpack.dev');
const getHostConfig = require('./host.config');
const proxyMiddleWare = require('http-proxy-middleware');
const open = require('open');
const ora = require('ora');

module.exports = () => {
	const app = express(); // 初始化
	const webPackConfig = config();

	//给webpack带上配置
	const compiler = webpack(webPackConfig);
	const hostConfig = getHostConfig();

	const port = hostConfig.port;
	const host = hostConfig.host;
	let spinner;

	compiler.watch({}, (err, stats) => {
		if (err || stats.hasErrors()) {
			try {
				console.log(stats.toString('errors-only'));
			} catch (e) {}

			console.error(err);
			return;
		}
		if (spinner.isSpinning) {
			spinner.stop();
			open(`http://${host}:${port}`);
			console.log(chalk.green(`打包成功! Server running at http://${host}:${port}\n`));
			return;
		}
	});

	//自动更新编译代码中间件
	const devMiddleWare = require('webpack-dev-middleware')(compiler, {
		publicPath: webPackConfig.output.publicPath,
		stats: 'errors-warnings'
	});
	//自动刷新浏览器中间件
	const hotMiddleWare = require('webpack-hot-middleware')(compiler, {
		path: '/__webpack_hmr',
		log: false
	});

	//调用2个中间件
	app.use(devMiddleWare);
	app.use(hotMiddleWare);

	// 加载代理配置
	if (hostConfig.proxy && hostConfig.proxy.length !== 0) {
		hostConfig.proxy.forEach((item) => {
			app.use(item.path, proxyMiddleWare(item.option));
		});
	}

	app.listen(port, host, async () => {
		console.log(chalk.green(`服务正在启动，请稍后！\n`));
		spinner = ora(chalk.green(`Server running at http://${host}:${port}\n`)).start();
		spinner.color = 'green';
	});
};
