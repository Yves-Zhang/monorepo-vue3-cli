/*
 * @Author: yvesyfzhang
 * @Date: 2022-04-11 12:22:37
 * @LastEditors: yvesyfzhang
 * @LastEditTime: 2022-04-11 15:53:23
 * @Description: file content
 * @FilePath: /newProject/jest.conf.js
 */

module.exports = {
	preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
	testMatch: [ '<rootDir>/src/**/test/**/*.(spec|test).(js|jsx|ts|tsx)' ],
	transform: {
		'.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
		'^.+\\.jsx?$': 'babel-jest'
	},
	moduleNameMapper: {
		'\\.(s?css|less)$': 'identity-obj-proxy',
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	collectCoverage: false,
	reporters: [ 'default', 'jest-html-reporters' ],
	snapshotSerializers: [ 'jest-serializer-vue' ],
};
