/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 17:18:15
 * @LastEditors: yvesyfzhang yvesyfzhang@tencent.com
 * @LastEditTime: 2022-06-07 15:40:43
 * @Description: file content
 * @FilePath: /workspace-sv/sv-cli/sv-cli/webpack.config.js
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const utils = require('./utils')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { getPageConfig, getRootPath } = require('./utils/getConfigs')
const miniSVGDataURI = require('mini-svg-data-uri')

module.exports = () => {
  const rootPath = getRootPath()
  const projectFile = process.env.SV_PROJ
  const env = process.env.SV_ENV === 'prod' ? 'production' : 'development'
  const indexHtml = `${rootPath}/src/pages/${projectFile}/index.html`
  const htmlTemplate = utils.fileIsExist(indexHtml)
    ? indexHtml
    : `${rootPath}/index.html`

  const pageConfig = getPageConfig(projectFile)
  const { variable = {}, pageTitle, htmlConfig={} } = pageConfig
  const pageConfig_webpack = pageConfig.webpack || {}
  const aliasConfig = pageConfig_webpack.alias || {}
  const publicPathConfig = pageConfig_webpack.publicPath || undefined

  const publicPath = env === 'production' ? publicPathConfig : undefined
  const moduleConfig = pageConfig_webpack.module || []

  // 获取自定义变量
  const variableConfig = variable[process.env.SV_ENV] || null
  // 解析自定义变量
  let variables = {}
  if (variableConfig) {
    Object.keys(variableConfig).forEach(key => {
      variables[`process.env.SV_VAR_${key}`] = JSON.stringify(
        variableConfig[key]
      )
    })
  }

  let alias = {
    vue: 'vue/dist/vue.esm-bundler.js',
    '@': path.resolve(rootPath, 'src'),
    '@pages': path.resolve(rootPath, 'src/pages'),
    ...aliasConfig
  }

  const urlReg = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/gi

  return {
    mode: env,
    devtool: env !== 'production' ? 'cheap-module-source-map' : false,
    output: {
      publicPath:
        publicPath && publicPath.match(urlReg).length > 0
          ? `${publicPath}/${projectFile}`
          : publicPath
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
              options: {
                sourceMap: env !== 'production' ? true : false
              }
            }
          ]
        },
        {
          test: /\.(scss|sass)$/,
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
              loader: 'sass-loader',
              options: {
                sourceMap: env !== 'production' ? true : false
              }
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
              content = content.toString()
              return miniSVGDataURI(content)
            },
            filename: 'images/[name].[contenthash:6][ext]'
          }
        },
        // 字体文件
        {
          test: /\.(otf|eot|woff2?|ttf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'font/[name].[contenthash:6][ext]'
          }
        },
        // 数据文件
        {
          test: /\.(txt|xml)$/i,
          type: 'asset/source', // exports the source code of the asset
          generator: {
            filename: 'assets/[name].[contenthash:6][ext]'
          }
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
        title: pageTitle || 'document',
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false
        },
        scriptCDN: htmlConfig?.scriptCDN || [],
        styleCDN: htmlConfig?.styleCDN || [],
        env,
        variableConfig
      }),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        ...variables
      }),
      new ForkTsCheckerWebpackPlugin()
    ],
    resolve: {
      extensions: [
        '.js',
        '.vue',
        '.ts',
        '.jsx',
        '.json',
        '.scss',
        '.css',
        '.less'
      ],
      //配置别名，在项目中可缩减引用路径
      alias
    }
  }
}
