const CosUpload = require('../utils/upload');
const { getLocalConfigs, getPageConfig } = require('../utils/getConfigs');

let client;

const parmas = {
	test: {
		appId: '76160',
		secretId: 'bZqnhEpeAlhp9yyj7gcP9oRX',
		secretKey: '22OmQPxXexVA1c4kDClxU1G5gyXf1/U30G',
		host: 'gzc.vod.tencent-cloud.com',
		// bucket: 'sv',
	},
	prod: {
		appId: '75876',
		secretId: 'IST9J1WFUWblALQKchwXrQ90',
		secretKey: 'ztfTXGIYZVnWo3jUPqpl4e80DOG4M9KkC/',
		host: 'gzc.vod.tencent-cloud.com',
		// bucket: 'sv',
	}
};

function getClient() {
	const localConfigs = getLocalConfigs();
	const { cosConfig = {} } = localConfigs;

	const env = process.env.SV_ENV;
	if (!client) {
		client = new CosUpload({
			...parmas[env],
			...(cosConfig[env] || {})
		});
	}
	return client;
}

async function cosUploadFile(dirPath, targetPath) {
	const cos = getClient();
	await cos.uploadFile(dirPath, targetPath);
}

function cosUploadDir(dirPath, targetPath, currentPage) {
	const { testPathPrefix } = getPageConfig(currentPage);

	let cosPath = targetPath;
	let reg = /^[a-zA-Z0-9_-\u4e00-\u9fa5]+$/g;
	if (typeof testPathPrefix === 'boolean' && !!testPathPrefix) {
		cosPath = `${targetPath}/${new Date().valueOf()}`
	}
	if (typeof testPathPrefix === 'string' && reg.test(testPathPrefix)) {
		reg.lastIndex = 0;
		cosPath = `${targetPath}/${testPathPrefix}`
	}
	const cos = getClient();
	return cos.uploadDir(dirPath, cosPath);
}

module.exports = {
	cosUploadFile,
	cosUploadDir
};
