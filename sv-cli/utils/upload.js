const fs = require('fs');
const walker = require('folder-walker');

const COSAPI = require('@tencent/cosapi');

const { pathJoin, fileIsExist, validatePath } = require('.');

const ERRCODE = {
  0: 'ok',
  '-1': 'internal catch error',
  '-2': 'file or directory is not exist',
  '-3': 'file path is illegal',
  '-4': 'cos api error',
};;

/**
 * @class
 */
class CosUpload {
  /**
   * @constructor
   * @param {Object} prop constructor params
   * @param {String} prop.appId appId
   * @param {String} prop.secretId secretId
   * @param {String} prop.secretKey secretKey
   * @param {String} prop.prefix upload path prefix, default ws
   * @param {String} prop.allowRoot allow upload to root directory, default false
   * @param {Boolean} prop.isTest env is test environment or not, default false
   * @param {Boolean} prop.isDevnet network env is devnet or not
	 * @param {Boolean} prop.host host 7****.g**.vod.******-cloud.com
   */
  constructor(prop) {
    if (typeof prop !== 'object') {
      throw new TypeError('the constructor param need be an object');
    }
    this.method = 'put';
    this.allowRoot = prop.allowRoot || false;
    this.prefix = this.allowRoot ? (prop?.prefix || '') : (prop?.prefix || '');
    this.appId = prop.appId;
    this.secretId = prop.secretId;
    this.secretKey = prop.secretKey;
    this.isTest = prop.isTest || false;
    this.bucket = prop.bucket;
    this.cdnPathPrefix = this.isTest ? prop.hostTest || '' : prop.host || '';
		this.host = prop.host
    this.client = new COSAPI({
      // Appid
      appid: this.appId,
      // SecretID
      secretID: this.secretId,
      // SecretKey
      secretKey: this.secretKey,
      // if no this params, this.getHost() will error
      bucket: this.bucket,
      // host
      host: `${this.host}`,
      // request timeout，default 10000 ms
      timeout: 15000,
      // proxy, devnet env is necessary
      proxy: prop.isDevnet ? 'http://devnet-proxy.oa.com:8080' : false,
    });
  }

  /**
   * upload file to cos
   * @param {String} filePath file path
   * @param {String} targetPath cdn target path
   * @method
   */
  async uploadFile(filePath, targetPath) {
    if (!fileIsExist(filePath)) {
      return {
        code: -2,
        message: ERRCODE[-2],
      };
    }
    if (!validatePath(targetPath)) {
      return {
        code: -3,
        message: ERRCODE[-3],
      };
    }
    try {
      const uri = pathJoin(this.prefix, targetPath);

      const cosReqParams = {
        method: this.method,
        uri,
        bucket: this.bucket,
        body: fs.readFileSync(filePath),
      };
      const data = await this.client.run(cosReqParams);
      if (data && data.statusCode === 200) {
        return {
          code: 0,
          message: ERRCODE[0],
          data: {
            fullPath: this.cdnPathPrefix + uri,
          },
        };
      }
      return {
        code: -4,
        message: ERRCODE[-4],
      };
    } catch (error) {
      return {
        code: -1,
        message: ERRCODE[-1],
      };
    }
  }

  /**
   * upload directory api
   * @param {String} dirPath directory path
   * @param {String} targetPath cdn target path
   * @method
   */
  uploadDir(dirPath, targetPath) {
    return new Promise((resolve, reject) => {
      if (!fileIsExist(dirPath)) {
        resolve({
          code: -2,
          message: ERRCODE[-2],
        });
        return;
      }
      try {
        // read file tree
        const stream = walker([dirPath]);
        const files = [];
        const success = [];
        const fail = [];
        stream.on('data', (data) => {
          if (data.type === 'file') {
            files.push({
              localPath: data.filepath,
              targetPath: pathJoin(targetPath, data.relname.replace('\\', '/')),
            });
          }
        });
        stream.on('end', async () => {
          const len = files.length;
          // validate file path
          for (let i = 0; i < len; i += 1) {
            if (!validatePath(files[i].targetPath)) {
              resolve({
                code: -3,
                message: ERRCODE[-3],
              });
              return;
            }
          }
          // upload
          for (let i = 0; i < len; i += 1) {
            const uri = pathJoin(this.prefix, files[i].targetPath);

            const cosReqParams = {
              method: this.method,
              uri,
              bucket: this.bucket,
              body: fs.readFileSync(files[i].localPath),
            };

            const data = await this.client.run(cosReqParams);
            if (data && data.statusCode === 200) {
              success.push({
                fullPath: this.cdnPathPrefix + uri,
              });
            } else {
							console.log(files[i])
              fail.push({
                fullPath: files[i].localPath,
              });
            }
          }
          resolve({
            code: 0,
            message: ERRCODE[0],
            data: {
              success,
              fail: `${fail}`,
            },
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = CosUpload;