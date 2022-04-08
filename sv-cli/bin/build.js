#!/usr/bin/env node
/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-07 16:58:26
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-07 17:25:25
 * @Description: file content
 * @FilePath: /cli/sv-cli/bin/build.js
 */

const config = require('../webpack.pro');
const webpack = require('webpack');
const ora = require('ora');
const chalk = require('chalk');

module.exports = () => {
	spinner = ora(chalk.green(`正在打包，请稍后!\n`)).start();
	spinner.color = 'green';
	const webpackConfig = config();
	webpack(webpackConfig, (err, stats) => {
		if (err || stats.hasErrors()) {
			// Handle errors here
			spinner.stop();
			console.log(err, stats.compilation.errors);
			return;
		}
		spinner.stop();
		process.stdout.write(
			stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false
			})
		);
		console.log(chalk.green('\n webpack build complete!!!'));
	});
};
