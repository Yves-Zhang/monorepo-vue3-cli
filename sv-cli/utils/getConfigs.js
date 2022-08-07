const utils = require('./index');
const chalk = require('chalk');
const path = require('path');
const SEP = path.sep;

function getPageConfig(pageName) {
	const rootPath = getRootPath();
	let FilePath;

	FilePath = `${rootPath}/src/pages/${pageName}/page.config.js`;

	if (!utils.fileIsExist(FilePath)) {
		console.log(chalk.red('\n不存在page.config.js文件，请查看文件路径是否正确！！！'));
		return {};
	}

	return require(FilePath);
}

// 检测当前执行命令目录是page目录；依据 page.config.js 的位置；
function isPagePath() {
	const rootPath = process.cwd();
	if (utils.fileIsExist(`${rootPath}/page.config.js`)) {
		return true;
	}
	return false;
}

// 检测当前执行命令目录是工程根目录；依据 local.config.js 的位置；
function isRootPath() {
	const rootPath = process.cwd();
	if (utils.fileIsExist(`${rootPath}/local.config.js`)) {
		return true;
	}
	return false;
}

function getRootPath() {
	const cwdPath = process.cwd();
	if (isPagePath()) {
		return path.resolve(cwdPath, '../../../');
	}

	if (isRootPath()) {
		return cwdPath;
	}
}

function currentPage() {
	const cwdPath = process.cwd();
	const itemMatch = cwdPath.split(SEP);
	return itemMatch ? itemMatch.pop() : '';
}

function getLocalConfigs(){
	return require(`${getRootPath()}/local.config.js`)
}

module.exports = {
	currentPage,
	getRootPath,
	isRootPath,
	isPagePath,
	getPageConfig,
	getLocalConfigs
};
