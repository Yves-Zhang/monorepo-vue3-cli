#!/usr/bin/env node
/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 17:43:47
 * @LastEditors: yvesyfzhang yvesyfzhang@tencent.com
 * @LastEditTime: 2022-05-19 14:36:36
 * @Description: file content
 * @FilePath: /test/Users/yvesyfzhang/Documents/demo/vue3-cli/cli/sv-cli/bin/index.js
 */
const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const utils = require('../utils')
const start = require('./start')
const build = require('./build')
const cpDir = require('../utils/copyDir')
const path = require('path')
const ora = require('ora')
const { getRootPath, isPagePath, currentPage } = require('../utils/getConfigs')
const { cosUploadDir } = require('./uploadCos')
const { start: landunStart } = require('./landun')

const rootPath = getRootPath()
const envArgs = ['dev', 'test', 'prod']

program
  .command('start')
  .description('服务启动中……')
  .option(
    '-e --env [env]',
    '启动环境变量参数为[dev, test, prod]，默认dev',
    'dev'
  )
  .alias('e')
  .action(function (cmd) {
    const directorys = utils.checkoutFiles(`${rootPath}/src/pages`)
    const env = cmd.env
    if (envArgs.indexOf(env) < 0) {
      console.log(
        chalk.red('参数错误，启动环境变量参数为[dev, test, prod]，默认dev！')
      )
      return
    }
    process.env.SV_ENV = env

    // 当前为 /project/src/page/*** 文件夹
    if (isPagePath()) {
      const project = currentPage()
      process.env.SV_PROJ = project
      if (env === 'dev') {
        console.log(chalk.blue(`\n当前启动的是:${env}环境 ${project}项目\n`))
        start()
        return
      }
      if (env === 'prod' || env === 'test') {
        build()
        return
      }
      return
    }

    inquirer
      .prompt([
        {
          name: 'project',
          type: 'list',
          message: '请选择你的项目:',
          choices: [...directorys.directoryName]
        }
      ])
      .then(answer => {
        process.env.SV_PROJ = answer.project
        if (env === 'dev') {
          console.log(
            chalk.blue(`\n当前启动的是:${env}环境 ${answer.project}项目\n`)
          )
          start()
          return
        }
        if (env === 'prod' || env === 'test') {
          build()
          return
        }
      })
  })

program
  .command('create')
  .description('创建项目')
  .option('-p --project [project]', '创建项目名称')
  .option('-page --page [page]', '创建page名称')
  .action(async function (cmd) {
    const projectName = cmd.project || 'sv-vue3-cli'
    const pageName = cmd.page
    const dirRootPath = process.cwd()
    if (projectName && !pageName) {
      console.log(chalk.blue(`创建工程 ${projectName}`))
      spinner = ora(chalk.green(`正在创建，请稍后!\n`)).start()
      spinner.color = 'green'

      const tempPath = path.join(__dirname, '../../template')
      const toDir = `${dirRootPath}/${projectName}`
      try {
        await cpDir(tempPath, toDir)
      } catch (err) {
        spinner.stop()
        console.log(chalk.ret(`${err}`))
        return
      }
      spinner.stop()
      console.log(chalk.blue(`工程创建成功！ ${toDir}`))
    }

    if (pageName) {
      if (pageName === true) {
        console.log(chalk.red(`缺少pageName 参数！`))
        return
      }
      console.log(chalk.blue(`创建page ${pageName}`))
      spinner = ora(chalk.green(`正在创建page，请稍后!\n`)).start()
      spinner.color = 'green'
      const tempPath = path.join(__dirname, '../../template/src/pages/tempProj')
      const toDir = `${dirRootPath}/src/pages/${pageName}`
      try {
        await cpDir(tempPath, toDir)
      } catch (err) {
        spinner.stop()
        console.log(chalk.ret(`${err}`))
        return
      }
      spinner.stop()
      console.log(chalk.blue('page创建成功！'))
    }
  })

program
  .command('build')
  .description('服务启动中……')
  .option('-p --page [page]', '打包页面参数')
  .option('-e --env [env]', '启动环境变量参数为[test, prod]，默认test', 'test')
  .alias('e')
  .action(function (cmd) {
    const directorys = utils.checkoutFiles(`${rootPath}/src/pages`)
    const env = cmd.env
    if (envArgs.indexOf(env) < 0) {
      console.log(chalk.red('启动环境变量参数为[test, prod]，默认test'))
      return
    }
    process.env.SV_ENV = env

    // 当前为 /project/src/page/*** 文件夹
    if (isPagePath()) {
      const project = currentPage()
      process.env.SV_PROJ = project
      if (env === 'prod' || env === 'test') {
        build()
        return
      }
      return
    }

    if (!cmd.page || [...directorys.directoryName].indexOf(cmd.page) < 0) {
      inquirer
        .prompt([
          {
            name: 'project',
            type: 'list',
            message: '请选择你的项目:',
            choices: [...directorys.directoryName]
          }
        ])
        .then(answer => {
          process.env.SV_PROJ = answer.project
          console.log(
            chalk.blue(`\n当前构建的是:${env}环境 ${answer.project}项目\n`)
          )
          build()
        })
      return
    }

    process.env.SV_PROJ = cmd.page
    console.log(chalk.blue(`\n当前构建的是:${env}环境 ${cmd.page}项目\n`))
    build()
    return
  })

program
  .command('publish')
  .description('上传cos服务……')
  .option('-e --env [env]', '发布环境变量参数为[test, prod] 默认test', 'test')
  .alias('e')
  .action(function (cmd) {
    const env = cmd.env
    if (envArgs.indexOf(env) < 0) {
      console.log(
        chalk.red('参数错误，发布环境变量参数为[test, prod] 默认test')
      )
      return
    }
    process.env.SV_ENV = env

    let directorys

    try {
      directorys = utils.checkoutFiles(`${rootPath}/dist`)
    } catch (err) {
      console.log(err)
      console.log(chalk.red(`\n 获取文件路径错误！\n`))
      return
    }
    const dirRootPath = process.cwd()

    // 当前为 /project/src/page/*** 文件夹
    if (isPagePath()) {
      console.log(chalk.red(`\n 请在根目录下执行命令！\n`))
      return
    }

    inquirer
      .prompt([
        {
          name: 'project',
          type: 'list',
          message: '请选择你要上传的项目:',
          choices: [...directorys.directoryName]
        }
      ])
      .then(async answer => {
        spinner = ora(chalk.green(`正在上传cos, 请稍后!\n`)).start()
        const ret = await cosUploadDir(
          `${dirRootPath}/dist/${answer.project}`,
          `pages/${answer.project}`,
          answer.project
        )
        spinner.stop()
        console.log(`\n`)
        if (ret.data.fail.length) {
          ret.data.fail.forEach(f => {
            console.log(
              chalk.red(`上传失败链接： ${JSON.stringify(f.localPath)}`)
            )
          })
        } else {
          ret.data.success.forEach(s => {
            console.log(chalk.green(`上传成功： ${JSON.stringify(s.fullPath)}`))
          })
        }
        console.log(`\n`)
        return
      })
  })

program
  .command('landun')
  .description('触发蓝盾流水线')
  .option('-e --env [env]', '发布环境变量参数为[test, prod] 默认test', 'test')
  .alias('e')
  .action(function (cmd) {
    const env = cmd.env
    if (envArgs.indexOf(env) < 0) {
      console.log(
        chalk.red('参数错误，发布环境变量参数为[test, prod] 默认test')
      )
      return
    }
    process.env.SV_ENV = env

    let directorys

    try {
      directorys = utils.checkoutFiles(`${rootPath}/src/pages`)
    } catch (err) {
      console.log(err)
      console.log(chalk.red(`\n 获取文件路径错误！\n`))
      return
    }

    // 当前为 /project/src/page/*** 文件夹
    if (isPagePath()) {
      console.log(chalk.red(`\n 请在根目录下执行命令！\n`))
      return
    }

    inquirer
      .prompt([
        {
          name: 'project',
          type: 'list',
          message: '请选择你要发布的页面:',
          choices: [...directorys.directoryName]
        }
      ])
      .then(async answer => {
        await landunStart({
          PageName: answer.project,
          BuildEnv: env === 'prod' ? 'prod' : 'test',
          BuildDir: 'dist',
          ProjectDir: './'
        })
        return
      })
  })

program.parse(process.argv)
