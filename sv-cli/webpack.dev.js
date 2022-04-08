/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 17:18:15
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-07 16:43:52
 * @Description: file content
 * @FilePath: /cli/sv-cli/webpack.dev.js
 */
const webpackMerge = require('webpack-merge');
const path = require('path');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');

module.exports = () => {
	const rootPath = process.cwd();
	const projectFile = process.env.SV_PROJ;

	return webpackMerge.merge(
		{
			entry: [
				'webpack-hot-middleware/client?path=./__webpack_hmr&noInfo=true&reload=true',
				`${rootPath}/src/pages/${projectFile}`
			],
			output: {
				filename: '[name].js',
				path: path.resolve(__dirname, 'dist')
			},
			plugins: [ new webpack.HotModuleReplacementPlugin() ]
		},
		webpackConfig()
	);
};
