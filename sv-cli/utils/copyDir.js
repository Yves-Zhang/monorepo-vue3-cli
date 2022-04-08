/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-07 19:11:48
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-07 19:40:21
 * @Description: file content
 * @FilePath: /cli/sv-cli/utils/copyDir.js
 */
const fs = require('fs');
const stat = fs.stat;
/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
const copy = function(src, dst) {
	return new Promise((resolve, reject) => {
		// 读取目录中的所有文件/目录
		fs.readdir(src, function(err, paths) {
			if (err) {
				reject(err);
				return;
			}
			let tag = 0;
			paths.forEach(function(path) {
				tag += 1;
				const _src = src + '/' + path;
				const _dst = dst + '/' + path;
				let readable;
				let writable;
				stat(_src, function(err, st) {
					if (err) {
						reject(err);
						return;
					}
					// 判断是否为文件
					if (st.isFile()) {
						// 创建读取流
						readable = fs.createReadStream(_src);
						// 创建写入流
						writable = fs.createWriteStream(_dst);
						// 通过管道来传输流
						readable.pipe(writable);
					} else if (st.isDirectory()) {
						// 如果是目录则递归调用自身
						exists(_src, _dst, copy);
					}
				});
			});
			if (tag === paths.length) {
				resolve();
			}
		});
	});
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
const exists = function(src, dst, callback) {
	const { access } = fs;
	access(dst, function(err) {
		// 已存在
		if (err) {
			// 不存在
			fs.mkdir(dst, function() {
				callback(src, dst);
			});
		} else {
			callback(src, dst);
		}
	});
};
// 复制目录

module.exports = async (dir, toDir) => {
	await exists(dir, toDir, copy);
};
