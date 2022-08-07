/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 17:23:38
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-06 20:33:25
 * @Description: file content
 * @FilePath: /vue3-cli/sv-cli/utils/index.js
 */

const fs = require('fs');
const path = require('path');

function checkoutFiles(filesPath) {
	let result = {
		directory: [],
		directoryName: [],
		files: []
	};

	function finder(finderPath) {
		let files = fs.readdirSync(finderPath);

		files.forEach((val, index) => {
			let fPath = path.join(finderPath, val);
			let stats = fs.statSync(fPath);
			if (stats.isDirectory()) {
				result.directory.push(fPath);
				result.directoryName.push(val);
			}
			if (stats.isFile()) result.files.push(fPath);
		});
	}

	finder(filesPath);
	return result;
}

// 获取文件夹下的文件名称
/**
 * @param {string} folderPath 被读取的文件夹路径
 */
const getFilesName = (folderPath) => {
	let result = {
		dirs: [],
		files: []
	};
	const files = fs.readdirSync(folderPath);
	files.map((item, index) => {
		let stat = fs.lstatSync(`${folderPath}/${item}`);
		if (stat.isDirectory() === true) {
			result.dirs.push(item);
		} else {
			result.files.push(item);
		}
	});

	return result;
};

// 检测文件是否存在
/**
 * @param {string} folderPath 被读取的文件夹路径
 */
const fileIsExist = (folderPath) => {
	let err = null;
	try {
		fs.accessSync(folderPath, fs.constants.R_OK);
	} catch (error) {
		err = true;
		// console.log(error)
	}

	if (err) {
		return false;
	}
	return true;
};

// 读取文件方法
/**
 * @param {string} path 被读取的文件路径
 */
const readFileSync = (path) => {
	return fs.readFileSync(path, 'utf8');
};

// 写入文件方法
/**
 * @param {string} path 被写入的文件路径
 * @param {string} data 被写入的文件内容
 */
const writeFileSync = (path, data) => {
	fs.writeFileSync(path, data, {
		encoding: 'utf8',
		flag: 'w'
	});
};

// 删除文件夹
/**
 * @param {string} path 删除文件的路劲
 */
function delDir(path) {
	let files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach((file, index) => {
			let curPath = path + '/' + file;
			if (fs.statSync(curPath).isDirectory()) {
				delDir(curPath); //递归删除文件夹
			} else {
				fs.unlinkSync(curPath); //删除文件
			}
		});
		fs.rmdirSync(path);
	}
}

/**
 * splicing path slice
 * @param  {...any} args path splice
 */
function pathJoin(...args) {
	let path = '';
	const len = args.length;
	for (let i = 0; i < len; i += 1) {
		if (args[i].length) {
			if (args[i].startsWith('/')) {
				path += args[i];
			} else {
				path += `/${args[i]}`;
			}
			if (/\/$/.test(path)) {
				path = path.slice(0, -1);
			}
		}
	}
	return path;
}

/**
 * validate path
 * @param {String} path path
 */
function validatePath(path) {
	if (path.trim() === '' || path.trim() === '/') {
		return false;
	}
	return /^[0-9a-zA-Z!_\-./\\]+$/g.test(path);
}

function traverse(fs, dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		file = `${dir}/${file}`;
		const stat = fs.statSync(file);
		if (stat && stat.isDirectory()) results = results.concat(traverse(fs, file));
		else results.push(file);
	});
	return results;
}

module.exports = {
	checkoutFiles,
	getFilesName,
	fileIsExist,
	readFileSync,
	writeFileSync,
	delDir,
	pathJoin,
	validatePath,
	traverse
};
