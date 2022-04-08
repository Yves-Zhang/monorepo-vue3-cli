/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 17:18:15
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-08 16:45:44
 * @Description: file content
 * @FilePath: /cli/sv-cli/webpack.config.js
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const utils = require('./utils');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = () => {
	const rootPath = process.cwd();
	const projectFile = process.env.SV_PROJ;
	const env = process.env.SV_ENV === 'pro' ? 'production' : 'development';
	const indexHtml = `${rootPath}/src/pages/${projectFile}/index.html`;
	const htmlTemplate = utils.fileIsExist(indexHtml) ? indexHtml : `${rootPath}/index.html`;

	const pageConfig = require(`${rootPath}/src/pages/${projectFile}/page.config.js`);

	const aliasConfig = pageConfig.webpack.alias || {};
	const publicPath = env === 'production' ? pageConfig.webpack.publicPath : undefined;
	const moduleConfig = pageConfig.webpack.module || [];

	let alias = {
		vue: 'vue/dist/vue.esm-bundler.js',
		'@': path.resolve(rootPath, 'src'),
		'@pages': path.resolve(rootPath, 'src/pages'),
		...aliasConfig
	};

	const urlReg = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/gi;

	return {
		mode: env,
		devtool: env !== 'production' ? 'cheap-module-source-map' : false,
		output: {
			publicPath: publicPath && publicPath.match(urlReg).length > 0 ? `${publicPath}/${projectFile}` : publicPath
		},
		module: {
			rules: [
				{
					test: /(\.jsx|\.js)$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
					options: {
						transpileOnly: true
					}
				},
				{
					test: /\.vue$/,
					use: [
						{
							loader: 'vue-loader'
						}
					]
				},
				{
					test: /\.(less|css)$/,
					use: [
						env === 'development'
							? 'style-loader'
							: {
									loader: MiniCssExtractPlugin.loader,
									options: {
										publicPath:
											publicPath && publicPath.match(urlReg).length > 0
												? `${publicPath}/${projectFile}/`
												: publicPath
									}
								},
						{
							loader: 'css-loader',
							options: {}
						},
						{
							loader: 'less-loader',
							options: {}
						}
					]
				},
				// 图片文件
				{
					test: /\.(jpe?g|png|gif)$/i,
					type: 'asset',
					generator: {
						filename: 'images/[name].[contenthash:6][ext]' // 独立的配置
					}
				},
				// svg 文件
				{
					test: /\.svg$/i,
					type: 'asset',
					generator: {
						dataUrl(content) {
							content = content.toString();
							return miniSVGDataURI(content);
						}
					}
				},
				// 字体文件
				{
					test: /\.(otf|eot|woff2?|ttf|svg)$/i,
					type: 'asset',
					generator: {
						filename: 'fonts/[name].[contenthash:6][ext]'
					}
				},
				// 数据文件
				{
					test: /\.(txt|xml)$/i,
					type: 'asset/source' // exports the source code of the asset
				},
				...moduleConfig
			]
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				minChunks: 1,
				// name: true,
				cacheGroups: {
					common: {
						name: 'common',
						test: /node_modules\/(.*)\.js/,
						chunks: 'initial',
						minChunks: 1,
						enforce: true
					},
					style: {
						name: 'styles',
						test: /(\.less|\.css)$/,
						chunks: 'all',
						enforce: true
					}
				}
			}
		},
		plugins: [
			new CleanWebpackPlugin(),
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash:6].css',
				chunkFilename: '[name].[contenthash:6].css',
				ignoreOrder: false
			}),
			new HtmlWebpackPlugin({
				template: htmlTemplate,
				filename: 'index.html',
				title: 'sv-vue3-cli'
			}),
			new VueLoaderPlugin(),
			new webpack.DefinePlugin({
				__VUE_OPTIONS_API__: JSON.stringify(true),
				__VUE_PROD_DEVTOOLS__: JSON.stringify(false)
			}),
			new ForkTsCheckerWebpackPlugin()
		],
		resolve: {
			extensions: [ '.js', '.vue', '.ts', '.jsx', '.json', '.scss', '.css', '.less' ],
			//配置别名，在项目中可缩减引用路径
			alias
		}
	};
};
