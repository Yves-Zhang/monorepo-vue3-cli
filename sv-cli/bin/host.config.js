/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-06 19:08:02
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-08 11:41:51
 * @Description: file content
 * @FilePath: /cli/sv-cli/bin/host.config.js
 */
const path = require('path');
const { getRootPath } = require('../utils/getConfigs');
const srcPath = getRootPath();

let getConfig = function() {
	const serverConfig = require(path.resolve(srcPath, 'local.config.js'));
	return {
		host: '127.0.0.1',
		port: 8080,
		proxy: [],
		...serverConfig
	};
};

module.exports = getConfig;
