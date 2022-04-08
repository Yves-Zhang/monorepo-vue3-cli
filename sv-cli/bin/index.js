#!/usr/bin/env node
/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 17:43:47
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-08 11:15:00
 * @Description: file content
 * @FilePath: /test/Users/yvesyfzhang/Documents/demo/vue3-cli/cli/sv-cli/bin/index.js
 */
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const utils = require('../utils');
const start = require('./start');
const build = require('./build');
const cpDir = require('../utils/copyDir');
const path = require('path');
const ora = require('ora');

const rootPath = process.cwd();
const envArgs = [ 'dev', 'test', 'pro' ];

program
	.command('start')
	.description('服务启动中……')
	.option('-e --env [env]', '启动环境变量参数为[dev, test, pro]，默认dev', 'dev')
	.alias('e')
	.action(function(cmd) {
		const directorys = utils.checkoutFiles(`${rootPath}/src/pages`);
		const env = cmd.env;
		if (envArgs.indexOf(env) < 0) {
			console.log(chalk.red('参数错误，启动环境变量参数为[dev, test, pro]，默认dev！'));
			return;
		}

		inquirer
			.prompt([
				{
					name: 'project',
					type: 'list',
					message: '请选择你的项目:',
					choices: [ ...directorys.directoryName ]
				}
			])
			.then((answer) => {
				process.env.SV_ENV = env;
				process.env.SV_PROJ = answer.project;
				if (env === 'dev') {
					console.log(chalk.blue(`\n当前启动的是:${env}环境 ${answer.project}项目\n`));
					start();
					return;
				}
				if (env === 'pro' || env === 'test') {
					build();
					return;
				}
			});
	});

program
	.command('create')
	.description('创建项目')
	.option('-p --project [project]', '创建项目名称')
	.option('-page --page [page]', '创建page名称')
	.action(async function(cmd) {
		console.log(cmd)
		const projectName = cmd.project || 'sv-vue3-cli';
		const pageName = cmd.page;
		if (projectName && !pageName) {
			console.log(chalk.blue(`创建工程 ${projectName}`));
			spinner = ora(chalk.green(`正在创建，请稍后!\n`)).start();
			spinner.color = 'green';

			const tempPath = path.join(__dirname, '../../template');
			const toDir = `${rootPath}/${projectName}`;
			try {
				await cpDir(tempPath, toDir);
			} catch (err) {
				spinner.stop();
				console.log(chalk.ret(`${err}`));
				return;
			}
			spinner.stop();
			console.log(chalk.blue('工程创建成功！'));
		}

		if (pageName) {
			if (pageName === true) {
				console.log(chalk.red(`缺少pageName 参数！`));
				return;
			}
			console.log(chalk.blue(`创建page ${pageName}`));
			spinner = ora(chalk.green(`正在创建page，请稍后!\n`)).start();
			spinner.color = 'green';
			const tempPath = path.join(__dirname, '../../template/src/pages/tempProj');
			const toDir = `${rootPath}/src/pages/${pageName}`;
			try {
				await cpDir(tempPath, toDir);
			} catch (err) {
				spinner.stop();
				console.log(chalk.ret(`${err}`));
				return;
			}
			spinner.stop();
			console.log(chalk.blue('page创建成功！'));
		}
	});

program.parse(process.argv);
