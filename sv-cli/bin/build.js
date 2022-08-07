#!/usr/bin/env node
const config = require('../webpack.prod')
const webpack = require('webpack')
const ora = require('ora')
const chalk = require('chalk')

module.exports = () => {
  spinner = ora(chalk.green(`正在打包，请稍后!\n`)).start()
  spinner.color = 'green'
  const webpackConfig = config()
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      spinner.stop()
      console.log(err)
      return
    }
    spinner.stop()
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      })
    )
    console.log(chalk.green('\n webpack build complete!!!'))
  })
}
