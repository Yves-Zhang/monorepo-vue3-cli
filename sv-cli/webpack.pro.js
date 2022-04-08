/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 17:18:15
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-08 16:43:45
 * @Description: file content
 * @FilePath: /cli/sv-cli/webpack.pro.js
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
			entry: [ `${rootPath}/src/pages/${projectFile}` ],
			output: {
				filename: '[name]_[chunkhash:6].js',
				path: path.resolve(`${rootPath}/dist`, `${projectFile}`)
			},
			plugins: [
				new webpack.ids.HashedModuleIdsPlugin({
					hashFunction: 'sha256',
					hashDigest: 'hex',
					hashDigestLength: 20
				})
			]
		},
		webpackConfig()
	);
};
